import Link from "next/link";
import { Children } from "react";
import { getToolBySlug, getRelatedTools, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/tools";
import { toolFaqs } from "@/lib/faqs";
import { toolContent } from "@/lib/toolContent";
import { getGuideByToolSlug } from "@/lib/guides";
import FAQSection from "./FAQSection";
import PrintShareButtons from "./PrintShareButtons";
import { ToolSchema } from "./StructuredData";
import ToolAffiliateRecommendations from "./ToolAffiliateRecommendations";

interface ToolLayoutProps {
  slug: string;
  children: React.ReactNode;
  widgetFirst?: boolean;
  showDefaultReferences?: boolean;
  pageTitle?: string;
  focused?: boolean;
  nextAction?: {
    href: string;
    label: string;
    description: string;
  };
}

export default function ToolLayout({
  slug,
  children,
  widgetFirst = false,
  showDefaultReferences = true,
  pageTitle,
  focused = false,
  nextAction,
}: ToolLayoutProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const pageTool = pageTitle ? { ...tool, name: pageTitle } : tool;

  const related = getRelatedTools(slug, 4);
  const faqs = toolFaqs[slug] || [];
  const visibleFaqs = focused ? faqs.slice(0, 4) : faqs;
  const content = toolContent[slug];
  const companionGuide = getGuideByToolSlug(slug);
  const childItems = Children.toArray(children);
  const focusedCore = focused ? childItems.slice(0, 2) : children;
  const focusedReferences = focused && childItems.length > 2
    ? childItems[childItems.length - 1]
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Structured Data: SoftwareApplication + FAQPage + BreadcrumbList */}
      <ToolSchema tool={pageTool} faqs={visibleFaqs} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-plum-500 transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600">{pageTool.name}</span>
      </nav>

      {/* Title & category badge */}
      <div className="mb-8">
        <div className="flex flex-col items-start gap-3 mb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-display text-bark-800">
              {pageTool.name}
            </h1>
          </div>
          <PrintShareButtons toolName={pageTool.name} />
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${CATEGORY_COLORS[tool.category]}`}>
            {CATEGORY_LABELS[tool.category]}
          </span>
          {content?.skillLevel && (
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-plum-200">
              Skill level: {content.skillLevel}
            </span>
          )}

        </div>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-3">
          {tool.description}
        </p>
      </div>

      {!widgetFirst && (
        <>
          {/* YMYL Disclaimer */}
          {content?.disclaimer && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800 leading-relaxed">
                {content.disclaimer}
              </p>
            </div>
          )}

          {/* Answer capsule */}
          {content?.answerCapsule && (
            <div className="mb-8 p-5 bg-plum-50 border border-plum-200 rounded-xl">
              <p className="text-bark-700 leading-relaxed text-[15px]">
                {content.answerCapsule}
              </p>
            </div>
          )}

          {/* Pre-tool educational content */}
          {content?.introduction && (
            <section className="mb-10">
              <h2 className="section-heading">{content.introduction.title}</h2>
              {content.introduction.paragraphs.map((p, i) => (
                <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                  {p}
                </p>
              ))}
            </section>
          )}

          {content?.whatIs && (
            <section className="mb-10">
              <h2 className="section-heading">{content.whatIs.title}</h2>
              {content.whatIs.paragraphs.map((p, i) => (
                <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                  {p}
                </p>
              ))}
            </section>
          )}

          {content?.howCalculated && (
            <section className="mb-10">
              <h2 className="section-heading">{content.howCalculated.title}</h2>
              {content.howCalculated.paragraphs.map((p, i) => (
                <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                  {p}
                </p>
              ))}
            </section>
          )}
        </>
      )}

      {/* === TOOL UI === */}
      {focusedCore}

      {!focused && (
        <>
      <ToolAffiliateRecommendations slug={slug} />

      {widgetFirst && (
        <>
          {/* YMYL Disclaimer */}
          {content?.disclaimer && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800 leading-relaxed">
                {content.disclaimer}
              </p>
            </div>
          )}

          {/* Answer capsule */}
          {content?.answerCapsule && (
            <div className="mt-8 p-5 bg-plum-50 border border-plum-200 rounded-xl">
              <p className="text-bark-700 leading-relaxed text-[15px]">
                {content.answerCapsule}
              </p>
            </div>
          )}

          {/* Post-widget educational content */}
          {content?.introduction && (
            <section className="mt-10">
              <h2 className="section-heading">{content.introduction.title}</h2>
              {content.introduction.paragraphs.map((p, i) => (
                <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                  {p}
                </p>
              ))}
            </section>
          )}

          {content?.whatIs && (
            <section className="mt-10">
              <h2 className="section-heading">{content.whatIs.title}</h2>
              {content.whatIs.paragraphs.map((p, i) => (
                <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                  {p}
                </p>
              ))}
            </section>
          )}

          {content?.howCalculated && (
            <section className="mt-10">
              <h2 className="section-heading">{content.howCalculated.title}</h2>
              {content.howCalculated.paragraphs.map((p, i) => (
                <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                  {p}
                </p>
              ))}
            </section>
          )}
        </>
      )}

      {/* Educational content */}
      {content && (
        <>
          <section className="mt-12">
            <h2 className="section-heading">{content.howToUse.title}</h2>
            {content.howToUse.paragraphs.map((p, i) => (
              <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                {p}
              </p>
            ))}
          </section>

          <section className="mt-10">
            <h2 className="section-heading">
              {content.designPrinciples ? "Reading Your Design Output" : content.understandingResults.title}
            </h2>
            {content.understandingResults.paragraphs.map((p, i) => (
              <p key={i} className="text-bark-600 leading-relaxed mb-4 text-[15px]">
                {p}
              </p>
            ))}
          </section>

          <section className="mt-10">
            <h2 className="section-heading">{content.proTips.title}</h2>
            <div className="bg-cream-100 border border-cream-300 rounded-2xl p-6">

              <ul className="space-y-3">
                {content.proTips.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                    <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* Archetype A, Calculator: Use Cases */}
      {content?.useCases && (
        <section className="mt-10">
          <h2 className="section-heading">When to Use This Calculator</h2>
          <ul className="space-y-3">
            {content.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-plum-500 mt-1 flex-shrink-0">&#10003;</span>
                {uc}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Archetype A, Calculator: Common Mistakes */}
      {content?.commonMistakes && (
        <section className="mt-10">
          <h2 className="section-heading">Common Mistakes to Avoid</h2>
          <ul className="space-y-4">
            {content.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Archetype A, Calculator: Project Example */}
      {content?.projectExample && (
        <section className="mt-10">
          <h2 className="section-heading">Worked Example</h2>
          <div className="bg-sage-50 border border-sage-200 rounded-xl p-5">
            <p className="text-bark-600 text-[15px] leading-relaxed">{content.projectExample}</p>
          </div>
        </section>
      )}

      {/* Archetype B, Reference: Chart Guide */}
      {content?.chartGuide && (
        <section className="mt-10">
          <h2 className="section-heading">How to Read This Chart</h2>
          <p className="text-bark-600 text-[15px] leading-relaxed">{content.chartGuide}</p>
        </section>
      )}

      {/* Archetype B, Reference: Industry Standards */}
      {content?.industryStandards && (
        <section className="mt-10">
          <h2 className="section-heading">Industry Standards</h2>
          <p className="text-bark-600 text-[15px] leading-relaxed">{content.industryStandards}</p>
        </section>
      )}

      {/* Archetype B, Reference: Manufacturer Note */}
      {content?.manufacturerNote && (
        <section className="mt-10">
          <h2 className="section-heading">Real-World Variations</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-bark-600 text-[15px] leading-relaxed">{content.manufacturerNote}</p>
          </div>
        </section>
      )}

      {/* Archetype D, Technique: Technique Effect */}
      {content?.techniqueEffect && (
        <section className="mt-10">
          <h2 className="section-heading">What This Technique Does to Your Fabric</h2>
          <p className="text-bark-600 text-[15px] leading-relaxed">{content.techniqueEffect}</p>
        </section>
      )}

      {/* Archetype D, Technique: Steps */}
      {content?.techniqueSteps && (
        <section className="mt-10">
          <h2 className="section-heading">Step by Step</h2>
          <ol className="space-y-3 list-none">
            {content.techniqueSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-plum-100 text-plum-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Archetype D, Technique: Fiber Notes */}
      {content?.fiberNotes && (
        <section className="mt-10">
          <h2 className="section-heading">Fiber-Specific Notes</h2>
          <p className="text-bark-600 text-[15px] leading-relaxed">{content.fiberNotes}</p>
        </section>
      )}

      {/* Archetype D, Technique: Practice Project */}
      {content?.practiceProject && (
        <section className="mt-10">
          <h2 className="section-heading">Practice Project</h2>
          <div className="bg-cream-100 border border-cream-300 rounded-xl p-5">
            <p className="text-bark-600 text-[15px] leading-relaxed">{content.practiceProject}</p>
          </div>
        </section>
      )}

      {/* Project Ideas */}
      {content?.projectIdeas && (
        <section className="mt-10">
          <h2 className="section-heading">{content.projectIdeas.title}</h2>
          <ul className="space-y-3">
            {content.projectIdeas.ideas.map((idea, i) => (
              <li key={i} className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-sage-500 mt-1 flex-shrink-0">&#10003;</span>
                {idea}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Archetype C, Pattern: Design Principles */}
      {content?.designPrinciples && (
        <section className="mt-10">
          <h2 className="section-heading">Design Principles</h2>
          <p className="text-bark-600 text-[15px] leading-relaxed">{content.designPrinciples}</p>
        </section>
      )}

      {/* Archetype C, Pattern: Pattern Variations */}
      {content?.patternVariations && (
        <section className="mt-10">
          <h2 className="section-heading">Pattern Variations to Try</h2>
          <ul className="space-y-3">
            {content.patternVariations.map((variation, i) => (
              <li key={i} className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-sage-500 mt-1 flex-shrink-0">&#9670;</span>
                {variation}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Internal links */}
      {content?.internalLinks && content.internalLinks.length > 0 && (
        <section className="mt-10">
          <h2 className="section-heading">Explore Related Fiber Arts Tools</h2>
          <ul className="space-y-3">
            {content.internalLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="text-plum-500 hover:text-plum-600 hover:underline font-medium">
                  {link.label}
                </Link>
                {", "}
                <span className="text-bark-500 text-sm">{link.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Authority references */}
      {showDefaultReferences ? (
        <section className="mt-10">
          <h2 className="section-heading">References and Industry Standards</h2>
          <ul className="space-y-2 text-sm text-bark-500">
            <li>
              <a href="https://www.craftyarncouncil.com/standards/yarn-weight-system" target="_blank" rel="noopener noreferrer" className="text-plum-500 hover:text-plum-600 hover:underline">
                Craft Yarn Council, Yarn Weight System
              </a>
              {", Industry-standard yarn weight categories and gauge ranges"}
            </li>
            <li>
              <a href="https://www.craftyarncouncil.com/standards/hooks-and-needles" target="_blank" rel="noopener noreferrer" className="text-plum-500 hover:text-plum-600 hover:underline">
                Craft Yarn Council, Needle & Hook Sizes
              </a>
              {", Standard sizing charts for knitting needles and crochet hooks"}
            </li>
            <li>
              <a href="https://www.ravelry.com" target="_blank" rel="noopener noreferrer" className="text-plum-500 hover:text-plum-600 hover:underline">
                Ravelry
              </a>
              {", Yarn database, pattern library, and community for fiber artists"}
            </li>
          </ul>
        </section>
      ) : null}

      {/* Companion guides */}
      {companionGuide && (
        <section className="mt-12">
          <h2 className="section-heading">Learn More About This Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companionGuide && (
              <Link
                href={`/guides/${companionGuide.slug}`}
                className="tool-card group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📖</span>
                  <div>
                    <h3 className="font-medium text-bark-700 group-hover:text-plum-500 transition-colors">
                      {companionGuide.title}
                    </h3>
                    <p className="text-sm text-bark-400 mt-1 line-clamp-2">
                      {companionGuide.description}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Related tools */}
      <section className="mt-12">
        <h2 className="section-heading">Related Fiber Arts Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className="tool-card group">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{t.icon}</span>
                <div>
                  <h3 className="font-medium text-bark-700 group-hover:text-plum-500 transition-colors">
                    {t.shortName}
                  </h3>
                  <p className="text-sm text-bark-400 mt-1 line-clamp-2">
                    {t.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={faqs}
        heading={content?.chartGuide ? "Edge Cases & Exceptions" : "Frequently Asked Questions"}
      />

      {/* Project tracking callout */}
      <section className="mt-12">
        <div className="bg-cream-100 rounded-2xl border border-cream-300 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-3xl flex-shrink-0">🧶</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-bark-700 text-sm mb-1">
              Keep your place while you work
            </h3>
            <p className="text-sm text-bark-500 leading-relaxed">
              Use the FiberTools stitch counter for rows, rounds, repeats, and local project notes.
            </p>
          </div>
          <Link
            href="/stitch-counter"
            className="btn-primary text-sm whitespace-nowrap flex-shrink-0"
          >
            Open stitch counter →
          </Link>
        </div>
      </section>

        </>
      )}

      {focused && (
        <>
          {content?.howCalculated ? (
            <section className="mt-12">
              <h2 className="section-heading">Formula and calculation method</h2>
              {content.howCalculated.paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
                  {paragraph}
                </p>
              ))}
            </section>
          ) : null}

          {content?.projectExample ? (
            <section className="mt-10">
              <h2 className="section-heading">Worked example</h2>
              <div className="rounded-xl border border-sage-200 bg-sage-50 p-5 dark:border-sage-800 dark:bg-sage-950/20">
                <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
                  {content.projectExample}
                </p>
              </div>
            </section>
          ) : null}

          {content?.commonMistakes ? (
            <section className="mt-10">
              <h2 className="section-heading">Assumptions and limitations</h2>
              <ul className="space-y-3">
                {content.commonMistakes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
                    <span className="mt-1 font-bold text-amber-600" aria-hidden="true">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {focusedReferences}

          <FAQSection faqs={visibleFaqs} heading="Frequently Asked Questions" />

          {nextAction ? (
            <section className="mt-12 border-t border-bark-200 pt-8 dark:border-bark-700">
              <h2 className="section-heading">Next step</h2>
              <div className="rounded-2xl border border-sage-200 bg-sage-50 p-5 dark:border-sage-800 dark:bg-sage-950/20">
                <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
                  {nextAction.description}
                </p>
                <Link href={nextAction.href} className="btn-primary mt-4 inline-flex min-h-11 items-center">
                  {nextAction.label}
                </Link>
              </div>
            </section>
          ) : null}

          <div className="mt-12 border-t border-bark-200 pt-8 dark:border-bark-700">
            <ToolAffiliateRecommendations slug={slug} />
          </div>
        </>
      )}

    </div>
  );
}
