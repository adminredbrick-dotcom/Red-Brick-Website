import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-md border border-stone bg-white px-4 py-3 text-base text-ink placeholder:text-stone disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
