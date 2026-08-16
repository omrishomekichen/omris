import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./(auth)/AuthContext";
import Navbar from "./components/nav";
import ScrollReveal from "./components/ScrollReveal";
import { Libre_Caslon_Text, Work_Sans } from "next/font/google";
import Footer from "./components/footer";
import { CartProvider } from "./components/CartContext";
import { Toaster } from "react-hot-toast";
import { siteDescription, siteName, siteUrl } from "./seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "homemade pickles",
    "Indian pickles",
    "artisan pickles",
    "traditional spices",
    "Hyderabad pickles",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/artisanal-hero.jpg",
        alt: "Omri's Home Kichen handcrafted pickles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/artisanal-hero.jpg"],
  },
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display-lg",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${libreCaslon.variable} ${workSans.variable}`}
    >
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />

            <ScrollReveal />

            <main className="app-main">
              {children}
            </main>

            <Footer />


            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: "var(--font-body)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                },
                success: {
                  duration: 3000,
                },
                error: {
                  duration: 4000,
                },
              }}
            />
          </CartProvider>
        </AuthProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: siteName,
              description: siteDescription,
              url: siteUrl,
              image: `${siteUrl}/artisanal-hero.jpg`,
              email: "omrishomekichen@gmail.com",
              telephone: "+91 63014 53780",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                addressCountry: "IN",
              },
              sameAs: ["https://www.instagram.com/omrishomekichen"],
            }),
          }}
        />
      </body>
    </html>
  );
}
