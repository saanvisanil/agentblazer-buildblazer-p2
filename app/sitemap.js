import { getSite } from "@/lib/content";

// Search engines read this automatically at /sitemap.xml
export default function sitemap() {
  const site = getSite();
  const base = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  return site.nav.map((item) => ({
    url: `${base}${item.href === "/" ? "" : item.href}`,
    lastModified: new Date(),
  }));
}
