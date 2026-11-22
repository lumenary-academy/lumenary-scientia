import Link from "next/link";
import { ArrowRight, ArrowUpRight, Atom, BarChart3, Bot, Braces, Cog, Cpu, FlaskConical, Gem, Sigma, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getT, resolveLocale } from "@/i18n/server";
import { href } from "@/lib/href";
import { academyPage, linguaHome, PREP_URL, TUTORING_URL } from "@/lib/sites";
import { sampleLesson, scientiaSubjects } from "@/lib/subjects";
import { VerificationBadge } from "@/components/ui/Badges";

/** Each Scientia subject's icon and accent. */
const SUBJECT_LOOK: Record<string, { Icon: LucideIcon; accent: string }> = {
  mathematics: { Icon: Sigma, accent: "bg-gold" },
  statistics: { Icon: BarChart3, accent: "bg-gold" },
  computerScience: { Icon: Cpu, accent: "bg-compute" },
  programmingLanguages: { Icon: Braces, accent: "bg-compute" },
  electricalEngineering: { Icon: Zap, accent: "bg-sky" },
  robotics: { Icon: Bot, accent: "bg-human" },
  chemistry: { Icon: FlaskConical, accent: "bg-formal" },
  mechanicalEngineering: { Icon: Cog, accent: "bg-sky" },
  materialsScience: { Icon: Gem, accent: "bg-human" },
};

/** A lesson to try: its title (in the lesson's own language), and the course it belongs to when the title alone does not say. */
interface Sample {
  href: string;
  title: string;
  lang: string;
  context?: string;
}

/** A short list of lessons to try. */
function TryLessons({ title, samples, className = "" }: { title: string; samples: Sample[]; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-muted">{title}</p>
      <ul className="mt-1.5 space-y-1 text-sm leading-snug">
        {samples.map((s) => (
          <li key={s.href} lang={s.lang}>
            <Link prefetch={false} href={s.href} className="link">
              {s.title}
            </Link>
            {s.context && <span className="text-muted"> · {s.context}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A translated sentence whose `{name}` placeholders become links, so that each translation can place
 * them where its grammar needs them.
 */
function withLinks(text: string, links: Record<string, { href: string; label: string }>): React.ReactNode[] {
  return text.split(/(\{\w+\})/).map((part, i) => {
    const link = links[part.slice(1, -1)];
    return part.startsWith("{") && link ? (
      <a key={i} href={link.href} className="link font-semibold">
        {link.label}
      </a>
    ) : (
      part
    );
  });
}

/** Lumenary Scientia's front page: what it is, its subjects with lessons to try, and where to find a tutor or class. Lumenary Math's own front page is /math/. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getT(locale);
  const { open, pending } = scientiaSubjects();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 end-[-10%] h-[36rem] w-[36rem] rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <div className="container-page relative py-14 sm:py-20">
          <p className="eyebrow">{t("scientia.eyebrow")}</p>
          <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">{t("meta.siteName")}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2">{t("scientia.lead")}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-2">{t("scientia.free")}</p>
          <div className="mt-6 max-w-3xl rounded-xl border border-line bg-card px-5 py-4">
            <VerificationBadge label="ai-drafted" text={t("verify.ai-drafted")} />
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{t("scientia.honesty")}</p>
            <p className="mt-2 text-sm">
              <Link href={href(locale, "verification")} className="link font-semibold">
                {t("home.seeVerification")}
              </Link>
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#subjects" className="btn btn-primary">
              {t("divisions.scientiaCta")} <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
            </a>
            <Link href={href(locale, "about")} className="btn btn-ghost">
              {t("scientia.about")}
            </Link>
          </div>
        </div>
      </section>

      <section id="subjects" className="scroll-mt-20 bg-paper-2/40" aria-labelledby="subjects-title">
        <div className="container-page py-14 sm:py-16">
          <h2 id="subjects-title" className="text-3xl font-semibold text-ink sm:text-4xl">
            {t("divisions.subjectsTitle")}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {open.map((s) => {
              const look = SUBJECT_LOOK[s.key] ?? { Icon: Atom, accent: "bg-gold" };
              const samples = s.samples.map((p) => sampleLesson(p, locale)).map((l) => ({ href: href(locale, l.path), title: l.title, lang: l.lang, context: l.course }));
              // The subject's name links its page, and its link covers the card; the lessons to try sit above it.
              return (
                <li key={s.key} className="card group relative flex h-full flex-col overflow-hidden p-5 hover:shadow-[var(--shadow-lg)]">
                  <span className={`absolute inset-x-0 top-0 h-1 ${look.accent}`} aria-hidden="true" />
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper-2 text-ink">
                    <look.Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                    <Link href={href(locale, s.path)} className="after:absolute after:inset-0">
                      {t(`divisions.${s.key}`)}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-sm leading-snug text-ink-2">{t(`divisions.${s.key}Text`)}</p>
                  {samples.length > 0 && <TryLessons className="relative z-10 mt-4" title={t("divisions.tryLesson")} samples={samples} />}
                  <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-muted">
                    <span>
                      {s.courses ? `${t("divisions.coursesN", { n: s.courses })} · ` : ""}
                      {t("divisions.lessonsN", { n: s.lessons })}
                    </span>
                    <ArrowRight size={14} className="text-muted transition-transform group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
                  </span>
                </li>
              );
            })}
          </ul>
          {pending.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted">{t("divisions.pending")}:</span>
              {pending.map((k) => (
                <span key={k} className="chip">
                  {t(`divisions.${k}`)}
                </span>
              ))}
            </div>
          )}
          <p className="mt-10 max-w-3xl leading-relaxed text-ink-2">
            {withLinks(t("scientia.academy"), {
              academy: { href: academyPage(locale), label: t("nav.academy") },
              lingua: { href: linguaHome(locale), label: t("nav.lingua") },
              prep: { href: PREP_URL, label: t("nav.prep") },
            })}
          </p>
        </div>
      </section>

      {/* The site's one pointer to tutors and classes: a separate marketplace, disclosed, on this page only. */}
      <section id="tutors" className="scroll-mt-20 border-t border-line" aria-labelledby="tutors-title">
        <div className="container-page py-12 sm:py-14">
          <h2 id="tutors-title" className="text-2xl font-semibold text-ink">
            {t("scientia.tutors.title")}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">{t("scientia.tutors.text")}</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{t("scientia.tutors.owner")}</p>
          <p className="mt-4">
            <a href={TUTORING_URL} className="link inline-flex items-center gap-1 font-semibold">
              {t("scientia.tutors.link")} <ArrowUpRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
