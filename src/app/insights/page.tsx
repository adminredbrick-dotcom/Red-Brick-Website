import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/insights/article-parts";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";
import { contentRepository } from "@/lib/content/repository";
import { articleCategories, articleCategoryLabels, type ArticleCategory } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: routes.insights.title,
  description: routes.insights.description,
};

interface InsightsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseCategory(value: string | string[] | undefined): ArticleCategory | null {
  const v = Array.isArray(value) ? value[0] : value;
  return v && (articleCategories as readonly string[]).includes(v) ? (v as ArticleCategory) : null;
}

/**
 * Insights index: articles from the content repository, filtered by category
 * through the URL (`?category=`) so the filter works without JavaScript and
 * the view is shareable. Every article shows its reviewed date; drafts say so.
 */
export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const category = parseCategory((await searchParams).category);
  const list = await contentRepository.articles(category);
  const all = await contentRepository.articles();

  return (
    <>
      <PageIntro
        eyebrow="Insights"
        heading="Insights and guidance"
        lede="Practical, carefully sourced articles for landlords and tenants, with a clear reviewed date on every piece. Guidance, not legal advice — the official sources are listed on each article."
      />
      <section aria-labelledby="articles-heading" className="container-rb pb-16 md:pb-24">
        <h2 id="articles-heading" className="sr-only">
          Articles
        </h2>
        <nav aria-label="Article categories">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/insights"
                aria-current={category === null ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-md px-4 font-bold underline-offset-4",
                  category === null ? "bg-ink text-cream" : "bg-sand text-ink hover:underline",
                )}
              >
                All ({all.length})
              </Link>
            </li>
            {articleCategories.map((key) => {
              const count = all.filter((a) => a.category === key).length;
              return (
                <li key={key}>
                  <Link
                    href={`/insights?category=${key}`}
                    aria-current={category === key ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-md px-4 font-bold underline-offset-4",
                      category === key ? "bg-ink text-cream" : "bg-sand text-ink hover:underline",
                    )}
                  >
                    {articleCategoryLabels[key]} ({count})
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 text-stone" role="status">
          {list.length} {list.length === 1 ? "article" : "articles"}
          {category ? ` in ${articleCategoryLabels[category]}` : ""}
        </p>

        {list.length === 0 ? (
          <div className="mt-6 rounded-lg border-2 border-dashed border-stone-light bg-white/70 p-6 md:p-8">
            <h3 className="text-xl">Nothing in this category yet</h3>
            <p className="measure-body mt-2 text-stone">
              Articles are added as they are written and reviewed. Browse the other categories or ask
              us directly.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/insights" className="font-bold text-brick underline underline-offset-4">
                All articles
              </Link>
              <WhatsAppLink variant="inline" />
            </div>
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Articles">
            {list.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10 rounded-md bg-sand px-4 py-3 text-base text-ink">
          Articles marked “draft awaiting Red Brick review” have been prepared from official guidance
          and this site’s own approved copy, and are being checked before launch. Nothing here is
          legal advice.
        </p>
      </section>
    </>
  );
}
