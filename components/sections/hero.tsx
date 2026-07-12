import { Container } from "@/components/shared/container";
import { PromptInput } from "@/components/shared/prompt-input";
import { Reveal } from "@/components/shared/reveal";
import { ANIMATION } from "@/constants";

/**
 * Hero
 * Server Component — stays server-rendered; Reveal (the only client
 * piece) wraps each content block to orchestrate the staggered
 * entrance sequence on page load.
 */
export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-50/70 via-white to-white" />
        <div className="animate-float-slow absolute -top-16 -left-20 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
        <div className="animate-float-slower absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-float-slow absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent-300/30 blur-3xl" />
      </div>

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal triggerOnMount delay={0 * ANIMATION.stagger}>
            <span className="mb-6 inline-flex items-center rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-xs font-medium text-accent-700">
              AI Assistant, powered by GROQ
            </span>
          </Reveal>

          <Reveal triggerOnMount delay={1 * ANIMATION.stagger}>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              What would you like to{" "}
              <span className="bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">
                build
              </span>{" "}
              today?
            </h1>
          </Reveal>

          <Reveal triggerOnMount delay={2 * ANIMATION.stagger}>
            <p className="mt-5 max-w-xl text-base text-gray-500 sm:text-lg">
              Ask anything — write code, translate languages, draft emails, or
              summarize documents. SrajanGPT responds instantly.
            </p>
          </Reveal>

          <Reveal triggerOnMount delay={3 * ANIMATION.stagger} className="mt-10 w-full">
            <PromptInput />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}