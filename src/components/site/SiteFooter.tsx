import type { Locale } from "@/i18n/config";
import type { TFunction } from "@/i18n/dictionary";
import { href } from "@/lib/href";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { getCollection } from "@/lib/courses";
import { DIVISIONS_NAV, MATH_PROJECT_PAGES, MATH_TOOLS, navHref, PROJECT_PAGES, SCIENTIA_MORE, type NavItem, type SiteSection } from "@/lib/site-nav";
import { scientiaSubjects } from "@/lib/subjects";
import { FooterNav, type FooterColumn, type FooterLink } from "./FooterNav";

/**
 * The site footer. Its columns depend on the part of the site the page belongs to (src/lib/site-nav.ts):
 * Lumenary Math's pages list the subjects, Math's tools and the project pages; every other page lists
 * the subjects with the electives, Lumenary Academy and its two other divisions (on their own sites),
 * and the project pages with the source code. Both project columns end with a link to the front
 * page's "From the same owner" section, the footer's only pointer to the owner's other projects.
 */
export function SiteFooter({ locale, t }: { locale: Locale; t: TFunction }) {
  const link = (item: NavItem): FooterLink => ({ label: t(`nav.${item.key}`), href: navHref(item, locale) });
  const subjects: FooterLink[] = scientiaSubjects().open.map((s) => ({ label: t(`divisions.${s.key}`), href: href(locale, s.path) }));
  const lingua = link(DIVISIONS_NAV.find((i) => i.key === "lingua")!);
  // Outside Lumenary Math, Lumenary CS's electives follow its programming languages.
  const electives = SCIENTIA_MORE.find((i) => i.key === "electives")!;
  const after = subjects.findIndex((s) => s.href === href(locale, "cs/languages"));
  const withElectives = getCollection("cs/electives").length > 0 && after >= 0 ? [...subjects.slice(0, after + 1), link(electives), ...subjects.slice(after + 1)] : subjects;

  const divisions: FooterColumn = { title: t("nav.divisions"), links: DIVISIONS_NAV.map(link) };
  const project: FooterColumn = { title: t("footer.project"), links: PROJECT_PAGES.map(link) };
  const columns: Record<SiteSection, FooterColumn[]> = {
    math: [
      { title: t("footer.subjects"), links: [...subjects, lingua] },
      { title: t("nav.math"), links: MATH_TOOLS.map(link) },
      { title: t("footer.project"), links: MATH_PROJECT_PAGES.map(link) },
    ],
    scientia: [{ title: t("footer.subjects"), links: withElectives }, divisions, project],
  };

  return (
    <footer data-site-footer className="mt-24 border-t border-line bg-paper-2/60">
      <FooterNav columns={columns} motto={t("footer.motto")}>
        <div className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <Wordmark />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">{t("footer.mission")}</p>
        <p className="mt-4 font-display text-lg italic text-ink">{t("meta.tagline")}</p>
      </FooterNav>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:justify-between">
          <span>{t("footer.license")}</span>
          <span>{t("footer.noEndorsement")}</span>
        </div>
      </div>
    </footer>
  );
}
