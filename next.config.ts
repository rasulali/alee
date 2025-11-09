import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["localhost", "192.168.0.144"],
};

export default withNextIntl(nextConfig);
