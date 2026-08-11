
'use client';

import "./globals.css";
import { AuthProvider } from "./(auth)/AuthContext";
import Navbar from "./components/nav";
import { Libre_Caslon_Text, Work_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // No token → allow only public pages
    if (!token && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    // Token exists → don't allow login/signup
    if (token && pathname === "/login") {
      router.replace("/dashboard");
      return;
    }

    if (token && pathname === "/signup") {
      router.replace("/dashboard");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${libreCaslon.variable} ${workSans.variable}`}
    >
      <body>
        <AuthProvider>
          <Navbar />

          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}