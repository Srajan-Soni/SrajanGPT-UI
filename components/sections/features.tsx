import { Container } from "@/components/shared/container";
import { SectionTitle } from "@/components/shared/section-title";
import { FeatureCard } from "@/components/shared/feature-card";
import { Reveal } from "@/components/shared/reveal";
import { features, ANIMATION } from "@/constants";

/**
 * Features
 * Server Component. FeatureCard remains a Server Component (Step 12) —
 * it's passed as children into the client Reveal wrapper, so it never
 * needs its own "use client" directive just to gain scroll animation.
 */
export function Features() {
  const lastIndex = features.length - 1;

  return (
    <section id="features" className="py-16 sm:py-24">
      <Container>
        <SectionTitle
          eyebrow="Why SrajanGPT"
          title="Built for speed, made for everyone"
          subtitle="Every part of SrajanGPT is designed around one goal: getting you accurate answers as fast as possible."
          className="mb-12 sm:mb-16"
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const isLast = index === lastIndex;
            const isOrphan = isLast && features.length % 3 === 1;

            return (
              <Reveal key={feature.id} delay={(index % 3) * ANIMATION.stagger}>
                <FeatureCard
                  feature={feature}
                  className={
                    isOrphan
                      ? "sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-none lg:mx-0"
                      : undefined
                  }
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}