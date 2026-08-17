import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Homemade Pickles & Spices",
  description:
    "Browse Aira Pickles' small-batch homemade pickles and traditional spice blends.",
  alternates: {
    canonical: "/menu",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
