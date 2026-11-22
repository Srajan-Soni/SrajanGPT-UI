import type { Metadata } from "next";
import { siteConfig } from "@/constants";
import { HomeView } from "@/components/home/home-view";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function Home() {
  return <HomeView />;
}
