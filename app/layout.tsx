import "./globals.css";
import { AuthProvider } from "./(auth)/AuthContext";
import Navbar from "./components/nav";
import { Libre_Caslon_Text, Work_Sans } from "next/font/google";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${workSans.variable}`}>
      <body>
        <Navbar />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

