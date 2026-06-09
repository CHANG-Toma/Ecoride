"use client";

import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function LogoutButton({ className = "", variant = "ghost" }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <Button className={className} type="submit" variant={variant}>
        Deconnexion
      </Button>
    </form>
  );
}
