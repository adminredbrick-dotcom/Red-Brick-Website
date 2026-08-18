import { articles } from "./articles";
import { faqGroups } from "./faqs";
import type { Article, ArticleCategory, FaqGroup } from "./types";

/**
 * Repository boundary for editorial content. Pages talk to this interface
 * only; the local implementation reads the TypeScript content in this
 * folder, and a CMS adapter (Sanity is the agreed choice — project not yet
 * created, docs/OWNER-DECISIONS.md row 28) implements the same interface
 * later without touching the pages. See docs/CONTENT-EDITING.md.
 */
export interface ContentRepository {
  /** Published articles, newest first (drafts included pre-launch; see `indexable`). */
  articles(category?: ArticleCategory | null): Promise<readonly Article[]>;
  article(slug: string): Promise<Article | null>;
  related(article: Article, limit?: number): Promise<readonly Article[]>;
  faqs(key: FaqGroup["key"]): Promise<FaqGroup | null>;
}

export class LocalContentRepository implements ContentRepository {
  constructor(
    private readonly source: readonly Article[] = articles,
    private readonly faqSource: readonly FaqGroup[] = faqGroups,
  ) {}

  async articles(category?: ArticleCategory | null): Promise<readonly Article[]> {
    const list = category ? this.source.filter((a) => a.category === category) : this.source;
    return [...list].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn) || a.title.localeCompare(b.title));
  }

  async article(slug: string): Promise<Article | null> {
    return this.source.find((a) => a.slug === slug) ?? null;
  }

  async related(article: Article, limit = 3): Promise<readonly Article[]> {
    const picked = article.related.map((slug) => this.source.find((a) => a.slug === slug)).filter((a): a is Article => Boolean(a));
    if (picked.length < limit) {
      for (const a of this.source) {
        if (picked.length >= limit) break;
        if (a.slug !== article.slug && a.category === article.category && !picked.includes(a)) picked.push(a);
      }
    }
    return picked.slice(0, limit);
  }

  async faqs(key: FaqGroup["key"]): Promise<FaqGroup | null> {
    return this.faqSource.find((g) => g.key === key) ?? null;
  }
}

/** The repository the app uses; swap this single binding for the CMS adapter. */
export const contentRepository: ContentRepository = new LocalContentRepository();

/** Only reviewed articles may be indexed once the site launches (drafts stay noindex regardless of the site-wide rule). */
export function articleIndexable(article: Article): boolean {
  return article.reviewStatus === "reviewed";
}
