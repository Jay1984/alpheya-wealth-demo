"use client";

import dynamic from "next/dynamic";

export const PortfolioOverview = dynamic(
  () => import("@/components/portfolio-overview"),
  { ssr: false }
);

export const ApiTelemetry = dynamic(
  () => import("@/components/api-telemetry"),
  { ssr: false }
);
