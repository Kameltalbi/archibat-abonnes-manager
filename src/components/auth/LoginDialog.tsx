
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";

interface LoginDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function LoginDialog({ trigger, className }: LoginDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className={className}>
            <LogInIcon className="h-4 w-4 mr-2" />
            Se connecter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Connexion</DialogTitle>
          <DialogDescription className="text-center">
            Entrez vos identifiants pour accéder à votre compte.
          </DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
