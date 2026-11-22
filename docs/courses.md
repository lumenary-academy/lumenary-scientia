# Courses: Lumenary CS, Statistics, EE, Robotics, Chemistry, ME and Materials

Lumenary Math has its own knowledge graph, Lean library and experiments (see the [authoring guide](authoring-guide.md)). The other subjects are **courses**: a syllabus and a directory per lesson, rendered by the same lesson components. This guide is the contract for writing one.

Lumenary Lingua's language courses are no longer in this repository. They live in their own, [lumenary-academy/lumenary-lingua](https://github.com/lumenary-academy/lumenary-lingua) (whose README and CONTRIBUTING.md say how to write one), and are published at [lingua.lumenary.academy](https://lingua.lumenary.academy). This site's old Lingua addresses, `/<locale>/lingua/…`, redirect there (`vercel.json`).

| Course | Directory | Taught in | Pages |
| --- | --- | --- | --- |
| Lumenary CS | `content/cs/` | English | `/en/cs/`, `/en/cs/<slug>/` |
| Programming languages (Assembly … Zig) | `content/cs/languages/<id>/` | English | `/en/cs/languages/`, `/en/cs/languages/<id>/`, `/en/cs/languages/<id>/<slug>/` |
| Lumenary CS electives (Blockchains & Verifiable Computation …) | `content/cs/electives/<id>/` | English | `/en/cs/electives/`, `/en/cs/electives/<id>/`, `/en/cs/electives/<id>/<slug>/` |
| Lumenary Statistics | `content/statistics/` | English | `/en/statistics/`, `/en/statistics/<slug>/` |
| Lumenary EE (electrical engineering) | `content/ee/` | English | `/en/ee/`, `/en/ee/<slug>/` |
| Lumenary Robotics | `content/robotics/` | English | `/en/robotics/`, `/en/robotics/<slug>/` |
| Lumenary Chemistry | `content/chemistry/` | English | `/en/chemistry/`, `/en/chemistry/<slug>/` |
| Lumenary ME (mechanical engineering) | `content/me/` | English | `/en/me/`, `/en/me/<slug>/` |
| Lumenary Materials (materials science) | `content/materials/` | English | `/en/materials/`, `/en/materials/<slug>/` |

A Scientia subject is a directory under `content/` with a `course.json` (`statistics`, `cs`, `ee`, `robotics`, `chemistry`, `me`, `materials`); it is listed on the front page by `src/lib/subjects.ts`, and its routes are `src/app/[locale]/<id>/`; the families of courses nested in a subject are listed in `COLLECTIONS` in `src/lib/courses.ts` (`cs/languages`, `cs/electives`), and each has an index page at its path. A course's pages are generated only in the locale it is taught in; links from other locales point there (`src/lib/href.ts`, from `src/lib/generated/content-locales.json`).

## Files

```
content/<course>/course.json              the syllabus (CourseFile in src/lib/schema.ts)
content/<course>/lessons/<slug>/lesson.mdx
content/<course>/lessons/<slug>/exercises.json
```

`course.json` lists the levels in order, each with its lessons in order; a lesson's level and position come from there. Every lesson directory must be in the syllabus and every syllabus slug must have a directory.

### lesson.mdx frontmatter

```yaml
---
title: Hash tables
subtitle: Constant-time lookup on average, and what it costs to get it.
minutes: 50
objectives:
  - Explain how a hash function maps keys to buckets
  - Implement a hash table with separate chaining
prerequisites: [lists-stacks-queues]      # earlier lessons of the same course (optional)
related: [math.prob.expectation]          # Lumenary Math topic ids (optional; must exist in content/math/graph/graph.json)
references:                               # further reading, by link (optional)
  - title: "Python's dict implementation notes"
    url: https://github.com/python/cpython/blob/main/Objects/dictnotes.txt
    note: How CPython's dictionaries actually work.
---
```

Fields: `title`, `subtitle`, `minutes` (positive integer), `objectives` (at least one), and optionally `narrators` (the cat guides who speak: `[chloe, margaret, gideon]` or a subset), `prerequisites`, `related`, `references` (each `title`, optional `author`, `year`, `url` (https), `note`). Quote YAML strings that contain `:` or start with a special character.

### lesson.mdx body

The body is a sequence of sections:

```mdx
<Section id="motivation" kind="motivation" title="Why hashing?">

Prose in Markdown. Inline maths with $O(n \log n)$; display maths with $$ … $$.

</Section>
```

Leave a blank line after every opening tag and before every closing tag. Section `id`s are unique within the lesson; `kind` is one of:

- CS: `motivation`, `intuition`, `definitions`, `examples`, `human` (shown as "Explanation"), `computation`, `visualization`, `misconceptions`, `history`, `reading`, `exercises`

Every lesson has at least three sections and exactly one `<Exercises/>`, inside a section of kind `exercises`, normally the last.

Components (anything else fails the tests):

| Component | Use |
| --- | --- |
| `<Definition term="…">` | a definition |
| `<Theorem name="…">`, `<Proof>` | a precise claim and its argument (CS: correctness, complexity bounds) |
| `<Example title="…">` | a worked example |
| `<Misconception>` | a common mistake and its correction |
| `<Note>` | an aside |
| `<Analogy>` | an everyday analogy, clearly marked as one |
| `<Figure caption="…">` | an inline SVG figure (`<svg viewBox=… role="img" aria-label=…>`; use `currentColor`, never fixed black or white, so dark mode works) |
| `<Narrator who="chloe\|margaret\|gideon">` | an aside by one of the three cat guides (see "The cat guides" below); list every cat who speaks in the frontmatter `narrators` |
| `<Reflection title="…">` | an optional, collapsed Christian reflection; at most one per lesson, never preachy, never required to follow the lesson |
| `<LessonLink slug="…">text</LessonLink>` | a link to another lesson of the same course |
| `<TopicLink id="math.…">text</TopicLink>` | a link to a Lumenary Math topic |
| `<Exercises/>` | where the lesson's exercises appear |

Plain Markdown is encouraged: headings (`###`, `####`; `##` is the section title), lists, tables (GFM), **bold**, *italics*, `inline code`, blockquotes, links.

Link to another course with a Markdown link to its page, e.g. `[feedback and PID](/en/robotics/feedback-and-pid/)`; `npm test` checks that the page exists. A link into a Scientia subject that is not published yet (its `course.json` is not in the tree) is shown as plain text until the subject ships, so lessons can link ahead to it (`linksToUnpublished` in `src/lib/subjects.ts`).

### Code

Fenced code blocks are highlighted (python, bash, sql, javascript, typescript, c, cpp, go, rust, java, json, yaml, html, css, diff; anything else is shown plain, e.g. `text`). A Python block whose fence reads ```` ```python run ```` gets **Run** and **Edit** buttons and runs in the learner's browser (Pyodide: CPython 3.13 with numpy, in a sandboxed worker).

In the programming-language courses, a block whose fence reads ```` ```rust check ```` (any language below) is a **complete program** that `npm run verify:courses` compiles and runs with that language's own toolchain; it must exit with status 0. Use `check` for every complete program you show, and plain fences for fragments. Fence names and how each is run (`compute/verify_courses.py`, `RUNNERS`):

| Fence | Saved as | Run with |
| --- | --- | --- |
| `asm` | main.s | GNU as (x86-64, Intel or AT&T syntax as the lesson says) + ld, no libc |
| `c`, `fortran` | main.c, main.f90 | gcc -std=c17, gfortran -std=f2018 |
| `cpp` | main.cpp | g++ 14 -std=c++23 |
| `rust`, `zig`, `go` | main.rs, main.zig, main.go | rustc (edition 2024), zig run, go run |
| `java` | Main.java | java 25, single-file launch |
| `kotlin`, `scala` | main.kt, main.scala | kotlinc + JDK 21, scala-cli |
| `csharp`, `fsharp`, `vb` | main.cs, main.fsx, Program.vb | .NET 10: dotnet run main.cs, dotnet fsi, a VB console project |
| `swift`, `dart` | main.swift, main.dart | swiftc, dart run |
| `javascript`, `typescript` | main.mjs, main.ts | Node 22; tsc --strict then node |
| `python`, `bash`, `perl`, `lua`, `ruby`, `php` | main.* | CPython 3.13, bash, perl 5, Lua 5.5, Ruby, PHP |
| `haskell`, `ocaml`, `elixir`, `erlang`, `clojure`, `scheme` | main.hs, main.ml, main.exs, main.erl (escript), main.clj, main.scm | runghc, ocaml, elixir, escript, clojure -M, chibi-scheme (R7RS) |
| `sql`, `r`, `julia`, `matlab` | main.sql, main.R, main.jl, main.m | sqlite3, Rscript, julia, GNU Octave |
| `prolog`, `cobol`, `ada`, `pascal` | main.pl, main.cob, main.adb, main.pas | SWI-Prolog, GnuCOBOL (free format), GNAT, Free Pascal |
| `lean` | main.lean | Lean 4 (the version in formal/lean-toolchain), core only, no Mathlib: `lean --run` when the file defines `main`, otherwise checked; `sorry` fails |
| `verilog` | main.v | Icarus Verilog 12 (`iverilog -g2012`, so SystemVerilog's `int`, `logic` and `always_ff` work) then `vvp`: the design and its self-checking testbench in one file; the testbench calls `$finish`, and `$fatal` on a failed check (which fails the check) |
| `spice` | main.cir | ngspice in batch mode (`ngspice -b`): a netlist with a `.control` block that runs the analysis and prints or `meas`ures results; an error, or an ignored invalid line, fails the check |

`compute/toolchains/setup.sh` installs these (tarballs under `~/.cache/lumenary-toolchains`, the rest as Docker images, run without network). A check whose toolchain is missing is reported as skipped and never counts as tested. To run one program by hand: `python3 compute/verify_courses.py --snippet rust path/to/main.rs`.

Every `python run` block is executed by `npm run verify:courses` in a fresh interpreter and must finish without an exception in under a minute. So a runnable block must be self-contained and must not use `input()`, threads, processes, sockets, the network, files outside a temporary directory, or randomness without a fixed seed when it prints results. Top-level `await` is allowed (the browser supports it). Write Python that also runs on CPython 3.10 (no `match` on 3.10-incompatible syntax, no PEP 695 generics). Use plain ```` ```python ```` (not runnable) for code that cannot meet these rules.

### MDX pitfalls

- Outside code, `{` `}` and `<` start JSX: write `\{`, `\}` and `&lt;`, or put the text in backticks.
- Outside code, `$` starts maths. Never write a bare dollar sign for money: write "USD 40" or `\$40`.
- Don't indent Markdown by four spaces inside components; it becomes a code block.

### exercises.json

```json
{
  "lesson": "<slug>",
  "exercises": [ … ]
}
```

At least 4 exercises per lesson, with unique kebab-case `id`s. Every exercise has `id`, `type`, `prompt` (Markdown), `difficulty` (`warm-up`, `core`, `stretch`), `mode` (`H` for ideas, `C` for code), `hints` (at least one, progressive) and `solution` (Markdown, a worked solution, not just the answer). By type:

- `choice`: `options` (`id`, `label`, `correct`, `feedback`: say *why* each option is right or wrong), optional `multiple: true`.
- `integer`: `answer` (an integer) and optional `feedback` (`match`: a wrong answer as a string, `message`).
- `set`: `answer` (strings; order and repeats ignored).
- `text`: `answers` (every accepted answer: list the reasonable variants, e.g. with and without contractions), optional `lang` (the answer's language, BCP 47, for the input's `lang` attribute), optional `feedback`. Case, spacing, surrounding punctuation and ¿¡ are ignored; accents are not, and a learner whose answer differs only in accents is told so.
- `python`: `starter` (what the learner edits), `tests` (Python with `assert`s, run after their code in the same namespace), `reference` (a correct solution). `npm run verify:courses` checks that the reference passes the tests and that the starter does not. The reference is never sent to the browser; the `solution` should still explain the approach and may show code.

Feedback never shames: "Not yet — …" rather than "Wrong".

## Writing

- **Original text only.** Write every explanation, example, dialogue, story and exercise yourself. Never copy or closely paraphrase textbooks, courses, interview-question sites, documentation, song lyrics, film scripts, or modern literature. Classic problems and well-known algorithms may be taught, in your own words and your own examples. Literary passages may be quoted only from works in the public domain (authors who died more than about a century ago, e.g. Cervantes, Bécquer, Austen, Dickens, Shakespeare), short, and credited.
- **Link, don't retell.** Papers, lab and company engineering blogs, official documentation, standards and open courses are linked in `references` or in the prose. Linking is always fine; copying is not.
- **Honest and current.** Say what is known, what is contested and what changes fast. For fast-moving fields (the AI frontier), give the durable ideas and date anything time-sensitive ("as of 2026"). Do not invent papers, numbers, quotations or URLs; if unsure of a URL, link the organisation's main page or leave it out.
- **No hype, no fear.** No marketing language, no score or salary promises.
- **No promotion.** A lesson, its exercises and its course page never link or name the owner's other projects (Lumenary Prep, Gideon Tasks, Gideon Tax, Peace Cat Games). They belong on the front page only: in "Tutors & classes" and, since 22 November 2026, in "From the same owner", which the footer links ([architecture.md](architecture.md#lumenary-academy-lingua-and-prep)); `tests/same-owner.test.ts` checks this.
- **For learners everywhere.** Examples from many countries and cultures; names from many languages.

### Lumenary CS

Each lesson goes from the idea to working code to the professional view: motivation, intuition, precise definitions, worked examples with runnable code, complexity and correctness where they apply, misconceptions, how it is done in industry or research (with links), and exercises that include at least one or two Python exercises where code makes sense. Higher levels are written for strong university students and working engineers; the frontier level should read like a briefing from someone who works at an AI lab, linking the primary papers and the labs' own documentation.

### Programming-language courses

One course per language under `content/cs/languages/<id>/` (`id` is the directory name), each with its own `course.json` (`group`: the family it is listed under; `year`: when the language appeared) in three levels — Foundations, Practice, Professional — of eight to ten lessons in all. A course takes a learner who knows what a variable and a loop are (Lumenary CS's Start level) from a first program in the language to the idioms, tools and practices of professionals who use it every day: its history and design philosophy, installing the official toolchain, the core language, its type system and signature features, errors and testing, concurrency or memory as the language frames them, its ecosystem, and a complete small project. Show what the program prints only as it actually printed when run. Exercises use `choice`, `integer`, `set` and `text` (for example "what does this program print?", answered as text).

### The cat guides

Lumenary Math's three cat guides appear in every Lumenary Scientia course too — Lumenary CS, its programming languages and electives, Lumenary EE and Lumenary Robotics. They are shown by default; anyone can hide them with the cat button, and then only the role ("The Formalist") and the text remain, so every aside must read well without the cat. Each `<Narrator who="…">` aside is 1–4 sentences and must add something; put it inside a section, between paragraphs, never inside another component. Every lesson has at least one; from the second level on, two to four, from more than one cat. List every cat who speaks in the frontmatter `narrators`.

Each cat keeps one character everywhere: **Chloe** brings the idea and the "why"; **Margaret** the numbers, measurements, computations and experiments; **Gideon** precision: the hidden assumption, the edge case, the precise condition, the limit of a model, safety. In Lumenary Math they are the Mathematician ("Why is this true?"), the Computationalist ("What happens if we calculate it?") and the Formalist ("Can we prove this precisely?"). Those roles don't fit other subjects, so every subject gives the cats its own roles: the label shown above each aside and on the course page, and the question that guides what the cat says. Write each aside in your subject's role, and don't name the role inside it (the page shows it).

| Subject | Chloe | Margaret | Gideon |
| --- | --- | --- | --- |
| Lumenary CS and its electives | The Computer Scientist: "What's the idea that makes it work?" | The Experimenter: "What happens when we run it?" | The Verifier: "Is it correct in every case?" |
| Programming languages | The Designer: "Why is the language built this way?" | The Profiler: "What does it print, and what does it cost?" | The Language Lawyer: "What exactly does the language guarantee?" |
| Lumenary EE | The Physicist: "What is really happening in the circuit?" | The Bench Engineer: "What would we measure?" | The Design Reviewer: "Where are the limits, and is it safe?" |
| Lumenary Robotics | The Builder: "How do we get a robot to do this?" | The Experimenter: "What happens when we simulate it?" | The Safety Engineer: "What could go wrong?" |
| Lumenary Chemistry | The Chemist: "Why do the atoms behave this way?" | The Analyst: "How much, and how do we know?" | The Sceptic: "Under what conditions is that true?" |
| Lumenary ME | The Designer: "What is it for, and how does it work?" | The Test Engineer: "What do the numbers say?" | The Checker: "What did we assume, and is there enough margin?" |
| Lumenary Materials | The Materials Scientist: "What is happening inside, down to the atoms?" | The Tester: "What does the test measure?" | The Failure Analyst: "How could it fail?" |
| Lumenary Statistics | The Statistician: "What question are we really asking?" | The Simulator: "What happens if we try it ten thousand times?" | The Sceptic: "What does this assume, and could it be chance?" |

The labels live in the messages under `narrators.sets.<set>` (all six locales); `guideSet` in `src/lib/courses.ts` picks a course's set: its `course.json` `guides` if given (a data-science elective may use `"statistics"`), `programming` for `cs/languages/*`, otherwise its subject's. A new subject adds its set to `GUIDE_SETS` in `src/lib/schema.ts` and to the messages.

In Start lessons the cats guide, ask and encourage; from then on they speak as friendly colleagues. Keep them correct and useful (no filler); a light feline touch now and then is welcome.

### Lumenary CS electives

An elective is a course nested in Lumenary CS (`content/cs/electives/<id>/`, listed on `/en/cs/electives/`) for a field the main course only touches: its own syllabus, usually in three levels from foundations to the research frontier, written to the same standard as Lumenary CS. Its description says which Lumenary CS lessons it assumes, and links them. A field that moves money or markets (the blockchain elective) is taught to inform, never to sell: no price talk, no investment advice, and fraud, failures and open problems are given as much room as successes.

### Lumenary Statistics and the data electives

Lumenary Statistics is a subject of its own: statistics as the science of learning from data under variation and uncertainty, from statistical literacy (Start, about age 11) to the frontier. Probability theory lives in Lumenary Math; link it rather than re-deriving it. The Lumenary CS electives Data Science, Data Engineering & Big Data, and Cloud Computing are practice-first; Data Science links to Lumenary Statistics for the methods. In these courses, Python blocks may also use pandas, SciPy, scikit-learn and pyarrow (pinned in compute/requirements.txt to the versions Pyodide bundles); prefer NumPy and the standard library when they suffice, since every package the browser loads costs the learner a download. Spark, Kafka, Airflow, Kubernetes, Terraform and cloud-provider code is shown in plain fences and labelled as not run. Name tools and providers fairly and by link; give costs and limits as plainly as benefits.

### Lumenary EE and Lumenary Robotics

The two engineering subjects follow Lumenary CS's pattern: from no experience at all (the Start level, from about age 11) to the frontier of 2026, each lesson going from the idea to a calculation or simulation to professional practice. Calculations, simulations and exercises are in Python with NumPy (```` ```python run ```` blocks and Python exercises, which run in the browser); Lumenary EE also shows hardware in Verilog and circuits as SPICE netlists, run by `verilog` and `spice` checks. Code that needs hardware, ROS 2, a vendor toolchain or a GPU (embedded C for a real microcontroller, a ROS 2 node, Solidity) is shown in plain fences and labelled as not run. Figures (inline SVG) are especially valuable here: circuit diagrams, block diagrams, waveforms, robot frames. Safety is part of the teaching: never suggest experiments with mains electricity, large batteries, high power or heavy machines; say what is safe (small batteries, current-limited supplies, small slow robots) and why industrial equipment is guarded and certified. Link datasheets, standards bodies, manufacturers' application notes, labs' papers and open-source projects; never copy them.

### Lumenary Chemistry, ME and Materials

They follow the same pattern as Lumenary EE and Robotics: a Start level for about age 11, then university material up to a frontier level for 2026, with calculations and simulations in Python (NumPy; SymPy where symbolic work helps) and SVG figures (molecules, apparatus, free-body diagrams, phase diagrams, crystal cells). Safety rules are stricter here:

- **Chemistry.** Suggest only kitchen-safe activities, done with an adult (an indicator from red cabbage, dissolving, crystallising salt or sugar); everything else belongs in a properly equipped laboratory with trained supervision. Never give instructions for making or concentrating hazardous substances — explosives, toxic gases, controlled drugs, chemical-warfare agents — even as history or as "what not to do"; discuss such topics only at the level of ideas, policy and history (the Chemical Weapons Convention, the Haber–Bosch story), and frame AI-for-chemistry's dual-use risks soberly. Teach hazard symbols (GHS) and safety data sheets. Never suggest tasting or smelling chemicals, or mixing household cleaners.
- **Mechanical engineering.** Suggest only safe making (cardboard, wood, plastic models, hand tools with supervision, 3D printers as intended); explain guards, protective equipment and pressure-vessel and lifting rules rather than encouraging anything risky.
- **Materials science.** Heat treatment, casting, furnaces and chemical etching are described, not suggested as home activities.

tests/safety.test.ts scans these courses too.

## Translations

Every course can be translated: `course.<locale>.json` next to `course.json` translates the course page, and `lesson.<locale>.mdx` with `exercises.<locale>.json` next to a lesson's English files translate the lesson. A translation keeps the English lesson's code, components and exercise data exactly and records its `translation` status and `sourceHash`; the site generates translated pages only where they exist. Volunteers' AI drafts, corrections and expert review are organised by Lumenary Every Nation: see [i18n/every-nation.md](i18n/every-nation.md). Write English lessons with translation in mind: keep code comments few and plain, and keep text out of code where it can live in prose.

## Checking

```bash
node scripts/gen-content-locales.mjs                       # after adding a course
npx vitest run tests/courses.test.ts                        # syllabus, frontmatter, exercises, components, MDX
npm run verify:courses -- --only cs/hash-tables             # run the lesson's code; updates the report
npm run dev                                                 # then open /en/cs/hash-tables/
```
