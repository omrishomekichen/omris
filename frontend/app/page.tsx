import type { Metadata } from "next";
import DashboardPage from "./(pages)/dashboard/page";

export const metadata: Metadata = {
  title: "Homemade Pickles & Traditional Spices",
  description:
    "Shop authentic, home-made pickles and traditional spices from Aira Pickles, handcrafted in small batches in Hyderabad.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <DashboardPage />;
}
