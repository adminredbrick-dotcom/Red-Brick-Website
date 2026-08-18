import type { NextConfig } from "next";

/**
 * Baseline security headers (phase-7 review). No Content-Security-Policy yet:
 * Next's inline runtime scripts need a nonce strategy, which is a launch-time
 * decision recorded in the owner register; the headers below are safe defaults.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep `next dev` from appending its agent-rules block to CLAUDE.md (project rules are hand-maintained).
  agentRules: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
