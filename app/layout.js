import "./globals.css";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeScript from "@/components/ThemeScript";
import { getSite } from "@/lib/content";
import CustomCursor from "@/components/CustomCursor";
import ClubChatbot from "@/components/ClubChatbot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const site = getSite();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} \u2014 ${site.college}`,
    template: `%s \u00b7 ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <CustomCursor />
        <ClubChatbot />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>

        <Nav site={site} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer site={site} />
      </body>
    </html>
  );
}
