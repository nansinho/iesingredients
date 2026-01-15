import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  MessageSquare,
  Eye,
  CheckCircle2,
  Clock,
  MailCheck
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  new: { label: 'Nouveau', icon: Clock, className: 'bg-blue-100 text-blue-800' },
  read: { label: 'Lu', icon: Eye, className: 'bg-amber-100 text-amber-800' },
  replied: { label: 'Répondu', icon: MailCheck, className: 'bg-green-100 text-green-800' },
};

export const ContactsListPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState('');

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const update: { status: string; notes?: string } = { status };
      if (notes !== undefined) update.notes = notes;
      
      const { error } = await supabase
        .from('contact_submissions')
        .update(update)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success('Statut mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const handleOpenContact = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setNotes(contact.notes || '');
    
    // Auto-mark as read if new
    if (contact.status === 'new') {
      updateStatusMutation.mutate({ id: contact.id, status: 'read' });
    }
  };

  const handleSaveNotes = () => {
    if (!selectedContact) return;
    updateStatusMutation.mutate({ 
      id: selectedContact.id, 
      status: selectedContact.status,
      notes 
    });
    toast.success('Notes enregistrées');
  };

  const filteredContacts = contacts?.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.first_name.toLowerCase().includes(searchLower) ||
      contact.last_name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.subject.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const newCount = contacts?.filter(c => c.status === 'new').length || 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages de contact"
        subtitle={`${contacts?.length || 0} message(s) au total${newCount > 0 ? ` • ${newCount} nouveau(x)` : ''}`}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredContacts?.length ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-medium mb-2">Aucun message</h3>
              <p className="text-muted-foreground text-sm">
                Les messages de contact apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => {
                    const status = statusConfig[contact.status] || statusConfig.new;
                    const StatusIcon = status.icon;

                    return (
                      <TableRow 
                        key={contact.id}
                        className={contact.status === 'new' ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {contact.first_name} {contact.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                            {contact.company && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Building2 className="w-3 h-3" />
                                {contact.company}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium line-clamp-1">{contact.subject}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {contact.message.slice(0, 60)}...
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(contact.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenContact(contact)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedContact && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {selectedContact.subject}
                </DialogTitle>
                <DialogDescription>
                  Reçu le {formatDate(selectedContact.created_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Contact Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Informations de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nom</p>
                      <p className="font-medium">{selectedContact.first_name} {selectedContact.last_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <a href={`mailto:${selectedContact.email}`} className="font-medium text-primary flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <p className="text-muted-foreground">Téléphone</p>
                        <a href={`tel:${selectedContact.phone}`} className="font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    {selectedContact.company && (
                      <div>
                        <p className="text-muted-foreground">Entreprise</p>
                        <p className="font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {selectedContact.company}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Message */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </CardContent>
                </Card>

                {/* Status & Notes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Statut & Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Select
                        value={selectedContact.status}
                        onValueChange={(value) => {
                          updateStatusMutation.mutate({ id: selectedContact.id, status: value });
                          setSelectedContact({ ...selectedContact, status: value });
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nouveau</SelectItem>
                          <SelectItem value="read">Lu</SelectItem>
                          <SelectItem value="replied">Répondu</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`, '_blank')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Répondre par email
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes internes</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ajouter des notes..."
                        rows={3}
                      />
                      <Button onClick={handleSaveNotes} size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Enregistrer les notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
