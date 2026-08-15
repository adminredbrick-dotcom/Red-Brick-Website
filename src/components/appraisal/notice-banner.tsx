import { cn } from "@/lib/utils";

interface NoticeBannerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Attention-styled honesty notice (demonstration / illustrative content).
 * Border + text carry the meaning, never colour alone.
 */
export function NoticeBanner({ title, children, className }: NoticeBannerProps) {
  return (
    <div
      role="note"
      className={cn("rounded-md border-2 border-attention bg-white px-5 py-4 text-ink", className)}
    >
      {title ? <p className="font-bold">{title}</p> : null}
      <div className={cn("text-base", title && "mt-1")}>{children}</div>
    </div>
  );
}
