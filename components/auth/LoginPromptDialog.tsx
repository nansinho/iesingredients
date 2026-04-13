"use client";

import { Heart, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";

interface LoginPromptDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LoginPromptDialog({ open, onClose }: LoginPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-peach/10">
            <Heart className="h-7 w-7 text-peach" />
          </div>
          <DialogTitle className="text-xl font-playfair">
            Sauvegardez vos favoris
          </DialogTitle>
          <DialogDescription className="text-dark/50 mt-2">
            Connectez-vous ou créez un compte pour ajouter des produits à vos favoris et les retrouver à tout moment.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Button asChild size="lg" className="w-full bg-brand-primary text-white hover:bg-brand-secondary rounded-xl gap-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={"/login" as any} onClick={onClose}>
              <LogIn className="w-4 h-4" />
              Se connecter
            </Link>
          </Button>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Button asChild variant="outline" size="lg" className="w-full rounded-xl gap-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={"/register" as any} onClick={onClose}>
              <UserPlus className="w-4 h-4" />
              Créer un compte
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
