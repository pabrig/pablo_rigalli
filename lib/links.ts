import { profile } from "./content";

export function bookingUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL?.trim();
  if (fromEnv) return fromEnv;
  return profile.bookingUrl.trim();
}

export const cvDownload = {
  href: profile.cvPath,
  fileName: "Pablo_Rigalli_Senior_Software_Engineer_2026_EN.pdf"
};
