-- ============================================================
-- Support Tickets + Messages + Notifications
-- ============================================================

-- 1. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  category text NOT NULL DEFAULT 'general'
    CHECK (category IN ('general', 'commande', 'facturation', 'technique')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users see their own tickets
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own tickets
CREATE POLICY "Users can create own tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any ticket (status changes)
CREATE POLICY "Admins can update any ticket"
  ON public.support_tickets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for performance
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

-- 2. SUPPORT MESSAGES
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean DEFAULT false,
  message text NOT NULL,
  attachment_url text,
  attachment_name text,
  created_at timestamptz DEFAULT now()
);

-- Auto-update ticket updated_at when new message
CREATE OR REPLACE FUNCTION public.update_ticket_on_message()
RETURNS trigger AS $$
BEGIN
  UPDATE public.support_tickets SET updated_at = now() WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER support_messages_update_ticket
  AFTER INSERT ON public.support_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_ticket_on_message();

-- RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages of their own tickets
CREATE POLICY "Users can view own ticket messages"
  ON public.support_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Users can insert messages on their own tickets
CREATE POLICY "Users can send messages on own tickets"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON public.support_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert messages on any ticket
CREATE POLICY "Admins can send messages on any ticket"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    public.has_role(auth.uid(), 'admin')
  );

-- Index
CREATE INDEX idx_support_messages_ticket_id ON public.support_messages(ticket_id);

-- 3. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'system'
    CHECK (type IN ('ticket_created', 'ticket_reply', 'ticket_status', 'order_status', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users see their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System/triggers can insert (SECURITY DEFINER functions handle this)
-- Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);

-- 4. TRIGGERS — Auto-create notifications

-- 4a. When a new support ticket is created → notify admins
CREATE OR REPLACE FUNCTION public.notify_admins_new_ticket()
RETURNS trigger AS $$
DECLARE
  admin_id uuid;
  client_name text;
BEGIN
  -- Get client name
  SELECT COALESCE(full_name, email, 'Un client') INTO client_name
  FROM public.profiles WHERE id = NEW.user_id;

  -- Notify all admins
  FOR admin_id IN
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      admin_id,
      'ticket_created',
      'Nouveau ticket support',
      client_name || ' : ' || NEW.subject,
      '/admin/support'
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ticket_created_notify_admins
  AFTER INSERT ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_ticket();

-- 4b. When a support message is sent → notify the other party
CREATE OR REPLACE FUNCTION public.notify_on_support_message()
RETURNS trigger AS $$
DECLARE
  ticket_owner uuid;
  ticket_subject text;
  sender_name text;
  admin_id uuid;
BEGIN
  -- Get ticket info
  SELECT user_id, subject INTO ticket_owner, ticket_subject
  FROM public.support_tickets WHERE id = NEW.ticket_id;

  -- Get sender name
  SELECT COALESCE(full_name, email, 'Quelqu''un') INTO sender_name
  FROM public.profiles WHERE id = NEW.sender_id;

  IF NEW.is_admin THEN
    -- Admin replied → notify the client
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      ticket_owner,
      'ticket_reply',
      'Réponse du support',
      'Nouvelle réponse sur : ' || ticket_subject,
      '/espace-client/support'
    );
  ELSE
    -- Client replied → notify all admins
    FOR admin_id IN
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    LOOP
      INSERT INTO public.notifications (user_id, type, title, message, link)
      VALUES (
        admin_id,
        'ticket_reply',
        'Réponse client',
        sender_name || ' a répondu sur : ' || ticket_subject,
        '/admin/support'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_support_message_notify
  AFTER INSERT ON public.support_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_support_message();

-- 4c. When ticket status changes → notify the client
CREATE OR REPLACE FUNCTION public.notify_on_ticket_status_change()
RETURNS trigger AS $$
DECLARE
  status_label text;
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  CASE NEW.status
    WHEN 'in_progress' THEN status_label := 'En cours de traitement';
    WHEN 'resolved' THEN status_label := 'Résolu';
    WHEN 'closed' THEN status_label := 'Fermé';
    ELSE status_label := NEW.status;
  END CASE;

  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NEW.user_id,
    'ticket_status',
    'Ticket mis à jour',
    NEW.subject || ' → ' || status_label,
    '/espace-client/support'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ticket_status_change_notify
  AFTER UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_ticket_status_change();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
