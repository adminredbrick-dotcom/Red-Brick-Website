import { notFound } from "next/navigation";

/**
 * Article route. No articles are published yet, so every slug resolves to
 * the branded not-found page. The Sanity-backed article template connects
 * here in Phase 6.
 */
export default function InsightArticlePage() {
  notFound();
}
