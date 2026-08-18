import { ImageResponse } from "next/og";

import { business } from "@/config/business";

export const alt = `${business.name} — ${business.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social preview image, generated at build time from confirmed
 * facts only (brand colours, name, tagline, service area). No photograph,
 * no AI imagery, no unconfirmed details.
 */
export default function OpenGraphImage() {
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
          background: "#a63d2f",
          color: "#f7f2ea",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, background: "#f7f2ea", borderRadius: 4 }} />
          <div style={{ fontSize: 34, letterSpacing: 4, textTransform: "uppercase" }}>{business.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>{business.tagline}</div>
          <div style={{ fontSize: 34, opacity: 0.9 }}>
            {`Residential lettings and property management across ${business.serviceArea}, since ${business.establishedYear}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
