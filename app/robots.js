import { getSite } from "@/lib/content";

export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || getSite().url;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
