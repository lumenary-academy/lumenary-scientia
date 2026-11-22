/**
 * Tutors and classes: the site's one pointer to tutors and classes. One plain section of the front page,
 * in every locale, says that the lessons are complete on their own, points to Gideon Tasks (a
 * separate marketplace) and says who runs it. Nothing else on the site, and no lesson, links there.
 * The owner's other projects follow in a section of their own (tests/same-owner.test.ts), which never
 * repeats Gideon Tasks.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES } from "@/i18n/config";
import { getMessages, makeT } from "@/i18n/dictionary";
import { TUTORING_URL } from "@/lib/sites";
import HomePage from "@/app/[locale]/page";
import { ROOT } from "./helpers";

const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

describe.each(LOCALES)("the tutors and classes section in %s", (locale) => {
  it("is on the front page once, with the disclosure and one link to Gideon Tasks", async () => {
    const html = decode(renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale }) })));
    const t = makeT(await getMessages(locale));
    for (const key of ["title", "text", "owner", "link"]) expect(html, key).toContain(t(`scientia.tutors.${key}`));
    expect(html.split('id="tutors"').length - 1).toBe(1);
    expect(html.split(`href="${TUTORING_URL}"`).length - 1).toBe(1);
  });

  it("keeps the names untranslated and names no price", async () => {
    const t = makeT(await getMessages(locale));
    for (const key of ["text", "owner", "link"]) expect(t(`scientia.tutors.${key}`), key).toContain("Gideon Tasks");
    expect(t("scientia.tutors.owner")).toContain("Gideon Solutions, LLC");
    expect(t("scientia.tutors.owner")).toContain("Lumenary Academy");
    for (const key of ["title", "text", "owner", "link"]) expect(t(`scientia.tutors.${key}`), key).not.toMatch(/[$€£₹¥]|\d/);
  });
});

describe("Gideon Tasks", () => {
  const walk = (dir: string): string[] =>
    fs.readdirSync(path.join(ROOT, dir), { recursive: true, encoding: "utf8" }).map((f) => path.join(dir, f)).filter((f) => fs.statSync(path.join(ROOT, f)).isFile());
  it("is linked from the front page only, and never from a lesson", () => {
    const linking = [...walk("src"), ...walk("content")].filter((f) => /gideontasks|TUTORING_URL/.test(fs.readFileSync(path.join(ROOT, f), "utf8")));
    expect(linking.sort()).toEqual([path.join("src", "app", "[locale]", "page.tsx"), path.join("src", "lib", "sites.ts")]);
  });
});
