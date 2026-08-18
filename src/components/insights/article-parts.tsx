import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatUkDate } from "@/lib/format";
import { articleCategoryLabels, type Article, type Block } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** Article card for the Insights index and "related" lists. The title is the link. */
export function ArticleCard({ article, headingLevel = "h3", className }: { article: Article; headingLevel?: "h2" | "h3"; className?: string }) {
  const Heading = headingLevel;
  const href = `/insights/${article.slug}`;
  return (
    <article className={cn("flex h-full flex-col rounded-lg bg-white p-6 shadow-soft", className)} aria-labelledby={`${article.slug}-title`}>
      <p className="text-eyebrow text-brick">{articleCategoryLabels[article.category]}</p>
      <Heading id={`${article.slug}-title`} className="mt-2 text-xl leading-snug">
        <Link href={href} className="rounded-sm text-ink underline-offset-4 hover:text-brick hover:underline">
          {article.title}
        </Link>
      </Heading>
      <p className="mt-3 text-stone">{article.excerpt}</p>
      <p className="mt-4 text-sm text-stone">
        Reviewed {formatUkDate(article.reviewedOn)}
        {article.reviewStatus === "draft" ? " · draft awaiting Red Brick review" : ""}
      </p>
      <p className="mt-auto pt-3">
        <Link href={href} className="inline-flex items-center gap-1 font-bold text-brick underline underline-offset-4 hover:text-brick-deep">
          Read the article
          <span className="sr-only">: {article.title}</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </p>
    </article>
  );
}

/** Portable-block renderer: paragraphs, headings (h2), lists, callouts and links. */
export function ArticleBody({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} id={block.id} className="mt-4 text-2xl md:text-3xl">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="measure-body text-lg text-ink">
                {block.text}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={i} className="measure-body flex list-decimal flex-col gap-2 pl-6 text-lg text-ink">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="measure-body flex list-disc flex-col gap-2 pl-6 text-lg text-ink">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={i}
                className={cn(
                  "rounded-lg border-l-4 bg-white p-5 shadow-soft",
                  block.tone === "attention" ? "border-attention" : "border-brick",
                )}
              >
                <p className="font-bold text-ink">{block.title}</p>
                <p className="measure-body mt-2 text-ink">{block.text}</p>
              </aside>
            );
          case "link": {
            const external = /^https?:\/\//.test(block.href);
            const cls = "inline-flex items-center gap-1 font-bold text-brick underline underline-offset-4 hover:text-brick-deep";
            return (
              <p key={i}>
                {external ? (
                  <a href={block.href} rel="noopener noreferrer" className={cls}>
                    {block.label} <span className="sr-only">(opens GOV.UK)</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={block.href} className={cls}>
                    {block.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </p>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
