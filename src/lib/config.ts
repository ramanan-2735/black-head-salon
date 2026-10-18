import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_TIER: z.enum(["professional", "premium"]).default("premium"),
  NEXT_PUBLIC_DEMO_MODE: z.enum(["true", "false"]).default("true"),
  NEXT_PUBLIC_BOOKING_MODE: z.enum(["instant", "approval"]).default("instant"),
});

export type SiteTier = z.infer<typeof envSchema>["NEXT_PUBLIC_SITE_TIER"];
export type BookingMode = z.infer<typeof envSchema>["NEXT_PUBLIC_BOOKING_MODE"];

export interface SiteConfig {
  tier: SiteTier;
  isPremium: boolean;
  isDemo: boolean;
  /** "instant" confirms a free slot straight away. "approval" leaves it pending for the owner. */
  bookingMode: BookingMode;
}

/**
 * Reads the tier, mode and booking flags. Invalid values fail the build instead
 * of silently falling back. Next.js only inlines NEXT_PUBLIC_* when each one is
 * accessed by its full property name, so the object below must stay literal.
 */
export function parseSiteConfig(env: Record<string, string | undefined>): SiteConfig {
  const parsed = envSchema.parse(env);
  return {
    tier: parsed.NEXT_PUBLIC_SITE_TIER,
    isPremium: parsed.NEXT_PUBLIC_SITE_TIER === "premium",
    isDemo: parsed.NEXT_PUBLIC_DEMO_MODE === "true",
    bookingMode: parsed.NEXT_PUBLIC_BOOKING_MODE,
  };
}

export const config = parseSiteConfig({
  NEXT_PUBLIC_SITE_TIER: process.env.NEXT_PUBLIC_SITE_TIER,
  NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  NEXT_PUBLIC_BOOKING_MODE: process.env.NEXT_PUBLIC_BOOKING_MODE,
});
