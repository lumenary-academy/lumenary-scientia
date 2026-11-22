import { href } from "./href";
import { academyPage, linguaHome, PREP_URL, SOURCE_URL } from "./sites";

/**
 * The site header's and footer's navigation. They were first designed for Lumenary Math alone; now
 * each page shows the navigation of the part of Lumenary Scientia it belongs to:
 *
 * - "math": Lumenary Math's own pages (/math/…, the labs, practice, progress and the educator
 *   resources, which are built from Math's lessons) keep Math's navigation;
 * - "scientia": every other page (the front page, the other subjects' pages, and the about,
 *   contribute, languages and verification pages) shows Scientia's subjects, the programming
 *   languages and electives, and the project pages, and nothing of Math's tools.
 *
 * Labels are `nav.<key>` (and `nav.short.<key>` in the header). Paths are site paths without the
 * locale; `site` marks a link to another site.
 */
export type SiteSection = "math" | "scientia";

export interface NavItem {
  key: string;
  path: string;
  /**
   * A link off this site, instead of to `path` here: a page of Lumenary Academy's site (`path` is
   * its path there, "" for its front page), Lumenary Lingua's or Lumenary Prep's front page, or
   * this site's source code.
   */
  site?: "academy" | "lingua" | "prep" | "source";
  /** A course's page: listed only once the course is published. */
  course?: true;
}

/** Lumenary Math's navigation, on its own pages. */
export const MATH_NAV: NavItem[] = [
  { key: "math", path: "math" },
  { key: "learn", path: "math/curriculum" },
  { key: "graph", path: "math/graph" },
  { key: "trails", path: "math/trails" },
  { key: "lab", path: "lab" },
  { key: "formal", path: "formal" },
  { key: "practice", path: "practice" },
  { key: "educators", path: "educators" },
  { key: "about", path: "about" },
];
/** The rest of the list in the menu on narrow screens, on Lumenary Math's pages. */
export const MATH_MORE: NavItem[] = [
  { key: "divisions", path: "divisions", site: "academy" },
  { key: "progress", path: "progress" },
  { key: "languages", path: "languages" },
  { key: "contribute", path: "contribute" },
  { key: "verification", path: "verification" },
];
/** Lumenary Math's tools, the footer's Math column on its pages. */
export const MATH_TOOLS: NavItem[] = MATH_NAV.filter((i) => !["math", "educators", "about"].includes(i.key));

/**
 * Lumenary Scientia's subjects, linked to one another everywhere outside Lumenary Math. They are in
 * the order of SUBJECTS in src/lib/subjects.ts, which a test checks.
 */
export const SCIENTIA_NAV: NavItem[] = [
  { key: "math", path: "math" },
  { key: "chemistry", path: "chemistry", course: true },
  { key: "statistics", path: "statistics", course: true },
  { key: "cs", path: "cs", course: true },
  { key: "programming", path: "cs/languages", course: true },
  { key: "ee", path: "ee", course: true },
  { key: "robotics", path: "robotics", course: true },
  { key: "me", path: "me", course: true },
  { key: "materials", path: "materials", course: true },
];
/** The rest of the list in the menu on narrow screens, outside Lumenary Math. */
export const SCIENTIA_MORE: NavItem[] = [
  { key: "electives", path: "cs/electives", course: true },
  { key: "about", path: "about" },
  { key: "contribute", path: "contribute" },
];

/** Lumenary Academy and its two other divisions, which have their own sites. */
export const DIVISIONS_NAV: NavItem[] = [
  { key: "academy", path: "", site: "academy" },
  { key: "lingua", path: "", site: "lingua" },
  { key: "prep", path: "", site: "prep" },
];
/**
 * The front page's "From the same owner" section (the projects are listed in src/lib/sites.ts), which the
 * footer's project column links once on every page, and nothing else does.
 */
export const OTHER_PROJECTS: NavItem = { key: "otherProjects", path: "#same-owner" };
/** This site's own pages, which belong to no one subject, its source code, and the owner's other projects. */
export const PROJECT_PAGES: NavItem[] = [
  { key: "about", path: "about" },
  { key: "contribute", path: "contribute" },
  { key: "languages", path: "languages" },
  { key: "verification", path: "verification" },
  { key: "source", path: "", site: "source" },
  OTHER_PROJECTS,
];
/** The footer's project column on Lumenary Math's pages, with Math's educator resources and progress page, and the owner's other projects. */
export const MATH_PROJECT_PAGES: NavItem[] = [
  { key: "about", path: "about" },
  { key: "divisions", path: "divisions", site: "academy" },
  { key: "educators", path: "educators" },
  { key: "contribute", path: "contribute" },
  { key: "languages", path: "languages" },
  { key: "verification", path: "verification" },
  { key: "progress", path: "progress" },
  { key: "source", path: "", site: "source" },
  OTHER_PROJECTS,
];

/** Lumenary Math's pages: its front page and everything under /math/, the labs, practice, progress and the educator resources. */
const MATH_PAGES = /^\/[^/]+\/(math|lab|formal|practice|progress|educators)(\/|$)/;

/** The part of the site a page belongs to, from its pathname ("/en/cs/functions/"). */
export function siteSection(pathname: string): SiteSection {
  return MATH_PAGES.test(pathname) ? "math" : "scientia";
}

/** Where a navigation item links: a locale-prefixed page on this site, or another site. */
export function navHref(item: NavItem, locale: string): string {
  switch (item.site) {
    case "academy":
      return academyPage(locale, item.path);
    case "lingua":
      return linguaHome(locale);
    case "prep":
      return PREP_URL;
    case "source":
      return SOURCE_URL;
    default:
      return href(locale, item.path);
  }
}
