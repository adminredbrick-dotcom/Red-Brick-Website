import { ImageResponse } from "next/og";

import { business } from "@/config/business";
import { contentRepository } from "@/lib/content/repository";
import { articleCategoryLabels } from "@/lib/content/types";

export const alt = "Article from Red Brick Lettings";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const all = await contentRepository.articles();
  return all.map((a) => ({ slug: a.slug }));
}

/** Per-article social image: category, title and the brand line — text only, generated at build time. */
export default async function ArticleOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await contentRepository.article(slug);
  const title = article?.title ?? "Insights and guidance";
  const category = article ? articleCategoryLabels[article.category] : "Insights";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#1d1b1a",
          color: "#f7f2ea",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, background: "#a63d2f", borderRadius: 4 }} />
          <div style={{ fontSize: 30, letterSpacing: 4, textTransform: "uppercase", color: "#e8d7c6" }}>
            {`${business.name} · ${category}`}
          </div>
        </div>
        <div style={{ fontSize: title.length > 70 ? 56 : 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 1050 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#e8d7c6" }}>{`Guidance for landlords and tenants in ${business.serviceArea}`}</div>
      </div>
    ),
    size,
  );
}
