import type { Blocker } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnsavedChangesDialogProps {
  blocker: Blocker;
}

export function UnsavedChangesDialog({ blocker }: UnsavedChangesDialogProps) {
  if (blocker.state !== "blocked") {
    return null;
  }

  return (
    <AlertDialog open onOpenChange={() => blocker.reset?.()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Modifications non enregistrées</AlertDialogTitle>
          <AlertDialogDescription>
            Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?
            Vos modifications seront perdues.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => blocker.reset?.()}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => blocker.proceed?.()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Quitter sans sauvegarder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
