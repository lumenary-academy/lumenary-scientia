/**
 * From the same owner: the owner's other projects (OWNER_PROJECTS in src/lib/sites.ts), on his rule of
 * 22 November 2026, which replaced his rule of 19 November 2026 that the site carry no promotion beyond
 * "Tutors & classes". One plain section of the front page, right after "Tutors & classes", in every
 * locale, says bluntly that Lumenary Academy's owner runs them, that some charge money, and that they
 * are listed because they are his; each has one honest line and one link. The footer's project column
 * links the section once on every page. No lesson, exercise or course page links or names them.
 */
import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES } from "@/i18n/config";
import { getMessages, makeT } from "@/i18n/dictionary";
import { OWNER_PROJECTS, PREP_URL, TUTORING_URL } from "@/lib/sites";
import { DIVISIONS_NAV, MATH_MORE, MATH_NAV, MATH_PROJECT_PAGES, navHref, OTHER_PROJECTS, PROJECT_PAGES, SCIENTIA_MORE, SCIENTIA_NAV } from "@/lib/site-nav";
import HomePage from "@/app/[locale]/page";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ROOT } from "./helpers";

const pathname = vi.hoisted(() => ({ current: "/en/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const count = (html: string, s: string) => html.split(s).length - 1;
const KEYS = ["title", "disclosure", ...OWNER_PROJECTS.map((p) => p.key)];

describe.each(LOCALES)("the same-owner section in %s", (locale) => {
  it("follows Tutors & classes on the front page, once, with the disclosure, a line and one link per project", async () => {
    const html = decode(renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale }) })));
    const t = makeT(await getMessages(locale));
    expect(count(html, 'id="same-owner"')).toBe(1);
    expect(html.indexOf('id="same-owner"')).toBeGreaterThan(html.indexOf('id="tutors"'));
    const start = html.indexOf('id="same-owner"');
    const section = html.slice(start, html.indexOf("</section>", start));
    for (const key of KEYS) expect(section, key).toContain(t(`scientia.sameOwner.${key}`));
    for (const p of OWNER_PROJECTS) {
      expect(section, p.name).toContain(p.name);
      expect(count(section, `href="${p.url}"`), p.url).toBe(1);
    }
    // The section never repeats Gideon Tasks, which Tutors & classes covers.
    expect(section).not.toContain(TUTORING_URL);
    // Peace Cat Games and Gideon Tax are linked nowhere else on the page (Lumenary Prep, a division, is also in the line about the academy).
    for (const p of OWNER_PROJECTS.filter((p) => p.url !== PREP_URL)) expect(count(html, p.url), p.url).toBe(1);
  });

  it("keeps the brands untranslated, says Lumenary Prep's price, and names no other", async () => {
    const t = makeT(await getMessages(locale));
    expect(t("scientia.sameOwner.disclosure")).toContain("Lumenary Academy");
    expect(t("scientia.sameOwner.prep")).toContain("Lumenary Academy");
    expect(t("scientia.sameOwner.prep")).toContain("$50");
    for (const key of ["title", "disclosure", "games", "tax"]) expect(t(`scientia.sameOwner.${key}`), key).not.toMatch(/[$€£₹¥]|\d/);
    for (const key of KEYS) expect(t(`scientia.sameOwner.${key}`), key).not.toMatch(/The Lumenary/);
    expect(t("nav.otherProjects")).toBeTruthy();
  });
});

describe("the footer", () => {
  it("links the section from the project column, once, on every kind of page and in every locale", () => {
    expect(PROJECT_PAGES.filter((i) => i === OTHER_PROJECTS)).toHaveLength(1);
    expect(MATH_PROJECT_PAGES.filter((i) => i === OTHER_PROJECTS)).toHaveLength(1);
    for (const list of [MATH_NAV, MATH_MORE, SCIENTIA_NAV, SCIENTIA_MORE, DIVISIONS_NAV]) expect(list.map((i) => i.key)).not.toContain(OTHER_PROJECTS.key);
    for (const locale of LOCALES) expect(navHref(OTHER_PROJECTS, locale)).toBe(`/${locale}/#same-owner`);
  });

  it.each(["/es/", "/es/cs/functions/", "/es/math/"])("renders that link once on %s, and none of the projects' own links", async (page) => {
    pathname.current = page;
    const t = makeT(await getMessages("es"));
    const html = decode(renderToStaticMarkup(SiteFooter({ locale: "es", t })));
    // next/link drops the trailing slash outside the build, which exports with trailingSlash: true.
    expect(html.match(/href="\/es\/?#same-owner"/g)).toHaveLength(1);
    expect(html).toContain(t("nav.otherProjects"));
    for (const p of OWNER_PROJECTS.filter((p) => p.url !== PREP_URL)) expect(html).not.toContain(p.url);
  });
});

describe("lessons", () => {
  const walk = (dir: string): string[] =>
    fs.readdirSync(path.join(ROOT, dir), { recursive: true, encoding: "utf8" }).map((f) => path.join(dir, f)).filter((f) => fs.statSync(path.join(ROOT, f)).isFile());
  const read = (f: string) => fs.readFileSync(path.join(ROOT, f), "utf8");

  it("Peace Cat Games and Gideon Tax are linked from the front page only", () => {
    const linking = [...walk("src"), ...walk("content")].filter((f) => /peacecatgames|gideontax\.com|OWNER_PROJECTS/.test(read(f)));
    expect(linking.sort()).toEqual([path.join("src", "app", "[locale]", "page.tsx"), path.join("src", "lib", "sites.ts")]);
  });

  it("no lesson, exercise or course links or names any of the owner's projects", () => {
    // Everything in content/ but the site's own pages (about, contribute), which say what Lumenary Prep is as a division.
    const lessons = walk("content").filter((f) => !f.startsWith(path.join("content", "pages") + path.sep));
    expect(lessons.length).toBeGreaterThan(400);
    const promo = /prep\.lumenary\.academy|peacecatgames|gideontax\.com|gideontasks|Lumenary Prep|Peace Cat Games|Gideon Tax\b|Gideon Tasks/;
    expect(lessons.filter((f) => promo.test(read(f)))).toEqual([]);
    // Nor do the components that render lessons, exercises and courses.
    const components = ["lesson", "exercises", "course"].flatMap((d) => walk(path.join("src", "components", d)));
    expect(components.filter((f) => /PREP_URL|TUTORING_URL|OWNER_PROJECTS|OTHER_PROJECTS|same-owner/.test(read(f)))).toEqual([]);
  });
});
