"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteUserAction } from "@/app/actions/admin/utilisateurs";
import { Button } from "@/components/ui/button";

type DeleteUserButtonProps = {
  id: number;
  email: string;
};

export function DeleteUserButton({ id, email }: DeleteUserButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return;
    startTransition(async () => {
      const result = await deleteUserAction(id);
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    <Button variant="ghost" type="button" disabled={isPending} onClick={handleDelete}>
      {isPending ? "..." : "Supprimer"}
    </Button>
  );
}
