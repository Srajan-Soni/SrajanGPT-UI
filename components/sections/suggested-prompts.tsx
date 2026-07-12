import { Container } from "@/components/shared/container";
import { PromptCard } from "@/components/shared/prompt-card";
import { Reveal } from "@/components/shared/reveal";
import { suggestedPrompts, ANIMATION } from "@/constants";

/**
 * SuggestedPrompts
 * Server Component. Each card is wrapped in Reveal (scroll-triggered,
 * staggered by grid index) — Reveal is the only client piece; PromptCard
 * itself keeps its own separate "use client" boundary from Step 11
 * (needed for its onClick, unrelated to animation).
 */
export function SuggestedPrompts() {
  return (
    <section aria-labelledby="suggested-prompts-heading" className="pb-4">
      <Container>
        <h2 id="suggested-prompts-heading" className="sr-only">
          Suggested prompts
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestedPrompts.map((prompt, index) => (
            <Reveal key={prompt.id} delay={index * ANIMATION.stagger}>
              <PromptCard prompt={prompt} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}