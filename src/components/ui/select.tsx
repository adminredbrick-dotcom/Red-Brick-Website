import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Native <select> styled to match Input. Native on purpose: it works without
 * JavaScript inside GET forms, is fully keyboard/screen-reader operable and
 * needs no extra dependency.
 */
function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex min-h-12 w-full appearance-none rounded-md border border-stone bg-white bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='%231d1b1a' d='M4 6l4 4 4-4z'/></svg>\")] bg-[length:16px_16px] bg-[position:right_0.9rem_center] bg-no-repeat px-4 py-2 pr-10 text-base text-ink disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
