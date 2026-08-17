import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep `next dev` from appending its agent-rules block to CLAUDE.md (project rules are hand-maintained).
  agentRules: false,
};

export default nextConfig;
