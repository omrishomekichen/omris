import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./(auth)/AuthContext";
import Navbar from "./components/nav";
import ScrollReveal from "./components/ScrollReveal";
import { Libre_Caslon_Text, Work_Sans } from "next/font/google";
import Footer from "./components/footer";
import { CartProvider } from "./components/CartContext";
import { Toaster } from "react-hot-toast";


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
      </body>
    </html>
  );
}
