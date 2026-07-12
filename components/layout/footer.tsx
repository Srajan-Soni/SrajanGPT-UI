import Link from "next/link";
// import { Github } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { siteConfig, footerLinkGroups } from "@/constants";

/**
 * Footer
 * Server Component — no interactivity needed, purely static content.
 * Mobile-first: stacked single column by default, expands to a
 * multi-column layout at the md breakpoint.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container as="div" className="py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
          {/* Brand column */}
          <div className="flex flex-col gap-4 md:max-w-xs">
            <Logo />
            <p className="text-sm leading-relaxed text-gray-500">
              {siteConfig.description}
            </p>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:flex md:gap-16">
            {footerLinkGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={
                          link.id === "github"
                            ? siteConfig.githubUrl
                            : link.href
                        }
                        target={link.id === "github" ? "_blank" : undefined}
                        rel={
                          link.id === "github"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t border-gray-200 pt-6 md:mt-12 md:flex-row md:justify-between md:pt-8">
          <p className="text-xs text-gray-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with Next.js &amp; FastAPI, powered by GROQ.
          </p>
        </div>
      </Container>
    </footer>
  );
}
