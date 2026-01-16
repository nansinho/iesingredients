import { Settings, Bell, Volume2, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNotificationPreferences } from "@/contexts/NotificationPreferencesContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { toast } from "sonner";

export default function SettingsPage() {
  const { preferences, updatePreference } = useNotificationPreferences();

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreference(key, value);
    toast.success("Préférence mise à jour");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Paramètres"
        subtitle="Gérez vos préférences de l'interface d'administration"
      />

      <div className="max-w-2xl space-y-6">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>
              Configurez comment vous souhaitez être notifié des nouvelles demandes et messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sound notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Volume2 className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="sound" className="text-sm font-medium">
                    Notifications sonores
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Jouer un son lors de nouvelles demandes
                  </p>
                </div>
              </div>
              <Switch
                id="sound"
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) => handleToggle("soundEnabled", checked)}
              />
            </div>

            <Separator />

            {/* Toast notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="toast" className="text-sm font-medium">
                    Notifications toast
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Afficher des popups pour les nouvelles activités
                  </p>
                </div>
              </div>
              <Switch
                id="toast"
                checked={preferences.toastEnabled}
                onCheckedChange={(checked) => handleToggle("toastEnabled", checked)}
              />
            </div>

            <Separator />

            {/* Email notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Notifications par email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recevoir un email pour chaque nouvelle demande
                  </p>
                </div>
              </div>
              <Switch
                id="email"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) => handleToggle("emailEnabled", checked)}
              />
            </div>

            {preferences.emailEnabled && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <p>
                  Les notifications email seront envoyées à l'adresse associée à votre compte.
                  Cette fonctionnalité sera bientôt disponible.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Notifications en temps réel</p>
                <p className="text-xs text-muted-foreground">
                  Les notifications s'affichent automatiquement lorsque de nouvelles demandes 
                  d'échantillons ou messages de contact sont reçus, même si vous êtes sur une autre page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
