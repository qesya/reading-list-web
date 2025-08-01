"use client";

import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { toggleRead } from "@/actions/book";

type Props = {
  id: number;
  read: boolean;
};

export function BookToggle({ id, read }: Props) {
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", id.toString());
      toggleRead(formData);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={read} onCheckedChange={onToggle} disabled={isPending} />
      <span className="text-sm text-muted-foreground inline-block">
        {read ? "Mark as unread" : "Mark as read"}
      </span>
    </div>
  );
}
