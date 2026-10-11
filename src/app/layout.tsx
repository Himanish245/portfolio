import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIMANISH — Developer & Creative Technologist",
  description:
    "Multidisciplinary developer and creative technologist building at the intersection of engineering, AI, cybersecurity, and interactive design.",
  keywords: [
    "developer",
    "creative technologist",
    "full-stack",
    "cybersecurity",
    "AI",
    "three.js",
    "portfolio",
  ],
  authors: [{ name: "Himanish" }],
  openGraph: {
    title: "HIMANISH — Developer & Creative Technologist",
    description:
      "Building across software, AI, cybersecurity, and interactive digital experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HIMANISH — Developer & Creative Technologist",
    description:
      "Building across software, AI, cybersecurity, and interactive digital experiences.",
  },
  other: {
    "theme-color": "#050505",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
