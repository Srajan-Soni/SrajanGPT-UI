import type { Metadata } from "next";
import { siteConfig } from "@/constants";
import { Hero } from "@/components/sections/hero";
import { SuggestedPrompts } from "@/components/sections/suggested-prompts";
import { Features } from "@/components/sections/features";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function Home() {
  return (
    <>
      <Hero />
      <SuggestedPrompts />
      <Features />
    </>
  );
}