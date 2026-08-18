"use client";

import * as React from "react";
import { Link2, MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ShareLinksProps {
  /** Absolute URL of the page (built on the server from the site origin). */
  url: string;
  title: string;
  /** Short caption used in the WhatsApp share text. */
  caption?: string;
}

/**
 * Share actions that need no third-party script: WhatsApp and Facebook share
 * links (plain anchors, work without JavaScript), plus JS-only "Copy link"
 * and the native share sheet where the browser offers one. No tracking
 * parameters are added.
 */
export function ShareLinks({ url, title, caption }: ShareLinksProps) {
  const [copied, setCopied] = React.useState(false);
  // Native share sheet availability is a browser fact; read it once via an external-store subscription
  // (server snapshot false) so server and first client render agree.
  const canShare = React.useSyncExternalStore(
    () => () => undefined,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );
  const text = `${caption ?? title} ${url}`;
  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Share this article" role="group">
      <Button asChild variant="outline" size="sm">
        <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" />
          Share on WhatsApp
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} rel="noopener noreferrer">
          <Share2 aria-hidden="true" />
          Share on Facebook
        </a>
      </Button>
      <span data-needs-js className="inline-flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            } catch {
              setCopied(false);
            }
          }}
        >
          <Link2 aria-hidden="true" />
          Copy link
        </Button>
        {canShare ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigator.share({ title, text: caption ?? title, url }).catch(() => undefined)}
          >
            <Share2 aria-hidden="true" />
            Share…
          </Button>
        ) : null}
        <span role="status" aria-live="polite" className="text-sm text-stone">
          {copied ? "Link copied" : ""}
        </span>
      </span>
    </div>
  );
}
