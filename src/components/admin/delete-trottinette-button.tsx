"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTrottinetteAction } from "@/app/actions/admin/trottinettes";
import { Button } from "@/components/ui/button";

type DeleteTrottinetteButtonProps = {
  id: number;
  modele: string;
};

export function DeleteTrottinetteButton({ id, modele }: DeleteTrottinetteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Supprimer le modele "${modele}" ?`)) return;
    startTransition(async () => {
      const result = await deleteTrottinetteAction(id);
      if (result?.error) {
        alert(result.error);
        return;
      }
      if (result?.success) {
        alert(result.success);
        router.refresh();
      }
    });
  }

  return (
    <Button variant="ghost" type="button" disabled={isPending} onClick={handleDelete}>
      {isPending ? "..." : "Supprimer"}
    </Button>
  );
}
