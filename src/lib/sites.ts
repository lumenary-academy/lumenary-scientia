/**
 * The addresses of this site and of the rest of Lumenary Academy. This site is Lumenary Scientia,
 * built from github.com/lumenary-academy/lumenary-scientia. Lumenary Academy's front page (with the
 * academy-level About, Divisions and Contribute pages), Lumenary Lingua and Lumenary Prep are built
 * from their own repositories.
 */

/** This site, Lumenary Scientia: the origin of its canonical URLs, sitemap and robots.txt. */
export const SITE_URL = "https://scientia.lumenary.academy";

/** This site's source code. */
export const SOURCE_URL = "https://github.com/lumenary-academy/lumenary-scientia";

/** Lumenary Academy's front page (github.com/lumenary-academy/lumenary-academy). Its pages exist in every locale. */
export const ACADEMY_URL = "https://lumenary.academy";

/** Lumenary Lingua (github.com/lumenary-academy/lumenary-lingua). Its front page exists in every locale. */
export const LINGUA_URL = "https://lingua.lumenary.academy";

/** Lumenary Prep. */
export const PREP_URL = "https://prep.lumenary.academy";

/**
 * Tutors and classes on Gideon Tasks, a separate marketplace run by Gideon Solutions, LLC. The site
 * links it once, from one section of the front page, and never from a lesson.
 */
export const TUTORING_URL = "https://www.gideontasks.com/tutoring";

/**
 * The owner's other projects, listed under a blunt disclosure in one section of the front page, "From
 * the same owner" (#same-owner, `scientia.sameOwner.*`, one line each), right after "Tutors & classes",
 * which already covers Gideon Tasks. The footer's project column links that section. They are never
 * linked or named in a lesson, an exercise or a course page. The owner's rule of 22 November 2026,
 * replacing his rule of 19 November 2026 (no promotion beyond "Tutors & classes").
 */
export const OWNER_PROJECTS = [
  { key: "prep", name: "Lumenary Prep", url: PREP_URL },
  { key: "games", name: "Peace Cat Games", url: "https://www.peacecatgames.com" },
  { key: "tax", name: "Gideon Tax", url: "https://www.gideontax.com" },
] as const;

/** A page of Lumenary Academy's site in a locale: https://lumenary.academy/<locale>/<path>/ (its front page without a path). */
export const academyPage = (locale: string, path = "") => `${ACADEMY_URL}/${locale}/${path && !path.endsWith("/") ? `${path}/` : path}`;

/** Lumenary Lingua's front page in a locale: https://lingua.lumenary.academy/<locale>/. */
export const linguaHome = (locale: string) => `${LINGUA_URL}/${locale}/`;
