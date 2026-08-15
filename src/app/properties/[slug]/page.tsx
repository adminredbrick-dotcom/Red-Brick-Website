import { notFound } from "next/navigation";

/**
 * Property detail route. No listings are published yet, so every slug
 * resolves to the branded not-found page — an honest 404, never a fake
 * property. The typed listings repository connects here in Phase 4.
 */
export default function PropertyDetailPage() {
  notFound();
}
