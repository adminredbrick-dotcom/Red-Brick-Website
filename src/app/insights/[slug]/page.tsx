import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ArticleBody, ArticleCard } from "@/components/insights/article-parts";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { ShareLinks } from "@/components/shared/share-links";
import { business } from "@/config/business";
import { articleIndexable, contentRepository } from "@/lib/content/repository";
import { articleCategoryLabels } from "@/lib/content/types";
import { formatUkDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo/site";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/** Only known slugs exist; anything else is the static 404 (rendered fully on the server, no JS needed). */
export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await contentRepository.articles();
  return all.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await contentRepository.article(slug);
  if (!article) return { title: "Article" };
  const url = absoluteUrl(`/insights/${article.slug}`);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    // Drafts stay out of search even after the site-wide pre-launch rule is lifted.
    robots: articleIndexable(article) ? undefined : { index: false, follow: false },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.socialCaption,
      url,
      siteName: business.name,
      locale: "en_GB",
      publishedTime: article.publishedOn,
      modifiedTime: article.reviewedOn,
      authors: [article.author],
      section: articleCategoryLabels[article.category],
      tags: [...article.tags],
      images: [{ url: absoluteUrl(`/insights/${article.slug}/opengraph-image`), width: 1200, height: 630, alt: article.title }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.socialCaption },
  };
}

/**
 * Article template: title, category, published/reviewed dates, review status,
 * body blocks, sources, share actions, related articles, and Article JSON-LD.
 * Draft articles carry a visible note until Red Brick reviews them.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await contentRepository.article(slug);
  if (!article) notFound();
  const related = await contentRepository.related(article, 3);
  const url = absoluteUrl(`/insights/${article.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedOn,
    dateModified: article.reviewedOn,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: business.name },
    mainEntityOfPage: url,
    articleSection: articleCategoryLabels[article.category],
    keywords: article.tags.join(", "),
    ...(article.sources.length ? { citation: article.sources.map((s) => s.href) } : {}),
  };

  return (
    <>
      <article className="container-rb pb-16 pt-8 md:pb-24 md:pt-12" aria-labelledby="article-title">
        <p>
          <Link href="/insights" className="inline-flex items-center gap-1 font-bold text-brick underline underline-offset-4">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All insights
          </Link>
        </p>
        <header className="mt-6 max-w-3xl">
          <p className="text-eyebrow text-brick">
            <Link href={`/insights?category=${article.category}`} className="underline-offset-4 hover:underline">
              {articleCategoryLabels[article.category]}
            </Link>
          </p>
          <h1 id="article-title" className="text-section mt-3">
            {article.title}
          </h1>
          <p className="measure-body mt-4 text-lg text-stone md:text-xl">{article.excerpt}</p>
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone">
            <div className="flex gap-1">
              <dt>By</dt>
              <dd className="font-bold text-ink">{article.author}</dd>
            </div>
            <div className="flex gap-1">
              <dt>Published</dt>
              <dd>
                <time dateTime={article.publishedOn}>{formatUkDate(article.publishedOn)}</time>
              </dd>
            </div>
            <div className="flex gap-1">
              <dt>Reviewed</dt>
              <dd>
                <time dateTime={article.reviewedOn}>{formatUkDate(article.reviewedOn)}</time>
              </dd>
            </div>
          </dl>
          {article.reviewStatus === "draft" ? (
            <p className="mt-4 rounded-md border-l-4 border-attention bg-sand px-4 py-3 text-ink" data-review-status="draft">
              <strong>Draft awaiting Red Brick review.</strong> Prepared from the official sources listed
              below and this site’s approved copy; it will be checked before launch. Guidance, not
              legal advice.
            </p>
          ) : null}
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div>
            <ArticleBody blocks={article.body} />

            {article.sources.length > 0 ? (
              <section aria-labelledby="sources-heading" className="mt-12">
                <h2 id="sources-heading" className="text-2xl">
                  Sources
                </h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {article.sources.map((s) => (
                    <li key={s.href} className="text-ink">
                      <a href={s.href} rel="noopener noreferrer" className="font-bold text-brick underline underline-offset-4">
                        {s.label}
                      </a>{" "}
                      <span className="text-sm text-stone">(read {formatUkDate(s.retrievedOn)})</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="share-heading" className="mt-12">
              <h2 id="share-heading" className="text-2xl">
                Share this article
              </h2>
              <div className="mt-4">
                <ShareLinks url={url} title={article.title} caption={article.socialCaption} />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div data-surface="dark" className="rounded-lg bg-ink p-6 text-cream">
              <p className="text-eyebrow text-sand">Talk to us</p>
              <p className="mt-2 text-lg font-bold">Have a question this article does not answer?</p>
              <p className="mt-2 text-cream/85">
                The quickest way to reach us is WhatsApp {business.whatsapp.displayNumber}. {business.meetings}
              </p>
              <div className="mt-4">
                <WhatsAppLink variant="button" className="bg-white text-ink hover:bg-sand" />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section aria-labelledby="related-heading" className="mt-16">
            <h2 id="related-heading" className="text-section">
              Related articles
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-3" aria-label="Related articles">
              {related.map((r) => (
                <li key={r.slug}>
                  <ArticleCard article={r} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>
    </>
  );
}
