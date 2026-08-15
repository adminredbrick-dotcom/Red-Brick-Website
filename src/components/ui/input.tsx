import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex min-h-12 w-full rounded-md border border-stone bg-white px-4 py-2 text-base text-ink placeholder:text-stone disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
