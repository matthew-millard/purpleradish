# purpleradish styling guide · v1

Locked July 2026. Companion to `tokens.css`. This doc explains the _why_; the CSS holds the _what_. When the two disagree, fix whichever one drifted.

## The one-line grammar

**Magenta means act. Green means alive or done. Everything else stays quiet on the lavender neutrals.**

Every color decision in the product should be answerable by that sentence. If a color appears and it isn't asking the user to act, and it isn't marking something live, done, or chosen, it probably shouldn't be there.

## Color

### The three families

**Lavender neutrals.** The whole surface system carries a whisper of violet instead of pure gray. This undertone is what makes the product read as light and airy rather than clinical, and it ties the neutrals to the brand without spending any color budget. Pure white and pure black never appear; the page is `#FDFCFE`, the darkest text is `#1C1A21`.

**Radish magenta.** The brand and the action color. `#E0399E` in light mode, brightening to `#EA5CB1` in dark (mid-saturation magentas vibrate against dark backgrounds; the lighter stop with dark text avoids the glow). Magenta 500/450 appears **once per view** as a filled element. Second and third actions demote to outlines, then text buttons in magenta 600.

**Spring green.** Hue 125, saturation 75. Reads as an honest leaf color and doubles as the success color, so there is no separate accent/success split. The electric stop `#4DE659` exists **only on dark surfaces** — it never touches a light background, where green text drops to the 600 stop `#26822E`.

### Intensity tiers

Three tiers, chosen per surface, never mixed on one screen:

- **Loud — marketing.** Magenta 900 hero surfaces, mint/green section backgrounds, highlighter marks behind headline words, the green-text-on-magenta duotone clash (maximum once per page — it vibrates by design). This is the only tier where color is allowed to be decorative.
- **Medium — default app UI.** Tint pills for statuses (green 100 / magenta 100 backgrounds with 800-level text), one filled magenta moment, green tints for selected states.
- **Quiet — operational UI (the default for anything staff stare at during service).** Exactly **one filled magenta and one filled green per screen**. Every other signal demotes to a 6px dot, an outline, or colored text. In-progress states are plain gray text — no pill at all. Waiting doesn't need a costume.

Dark mode roughly doubles perceived color loudness. The quiet budget is mandatory in dark mode regardless of what the light version does.

### Mode asymmetries (intentional, do not "fix")

- The Ready pill is a soft green tint in light mode but a **solid `#4DE659` fill** in dark — it's the one loud pill, visible across a kitchen.
- Dark surfaces keep the lavender undertone and cards sit _lighter_ than the page (the elevation flip). Never pure black.
- Navigation active state is **neutral** in both modes. Navigation is where you are, not something alive — it never gets green.

## Typography

### Three voices

| Voice    | Face                        | Job                                          | Rule                                                 |
| -------- | --------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| Brand    | Bricolage Grotesque 600/700 | Headlines, names, anything with feeling      | 21px and up only — it loses its ink traps below that |
| Speaking | Schibsted Grotesk 400/500   | Everything the product says                  | Below 21px                                           |
| Data     | Spline Sans Mono 400/500    | Anything measured, counted, timed, or priced | If it changes when reality changes, it's mono        |

The data voice is the workhorse: prices, times, counts, order IDs, quiet-hour ranges. A staff member scanning a screen finds every number instantly because numbers literally look different from words. Use `font-variant-numeric: tabular-nums`.

### The gap scale

`42 / 30 / 21 / 14 / 12` — deliberately no 16, 18, or 24. The jump from display to body is what creates hierarchy; polite intermediate sizes are where hierarchy goes to mush. If a design wants 18px, the content hasn't decided whether it's a 21 or a 14.

### Signature treatments

- **Labels are lowercase and letterspaced** (`12px`, `+2.5px` tracking): `tonight's service`, `total`, `your order`. Same trick as uppercase micro-labels, softer register, and nobody else does it.
- **Emphasis in running text is never bold.** It's Schibsted italic in magenta 600. Bold is reserved for structurally bold things: headings and totals. The italic slot is also where a restaurant's own personality lives in menu copy ("_The one everyone orders twice._").
- **Hanging numerals** for stats: oversized mono number with the label beside it, not above.

## The leaf-cut radius

Every element is rounded except the **bottom-left corner**, which stays nearly sharp — a leaf meeting its stem. The position never varies. The sharp corner scales with the element:

- `--pr-radius-sm` — `8px 8px 8px 1px` — badges, chips
- `--pr-radius-md` — `10px 10px 10px 2px` — buttons, inputs
- `--pr-radius-lg` — `14px 14px 14px 3px` — cards, alerts
- `--pr-radius-xl` — `16px 16px 16px 3px` — page containers

**Exceptions:** radios, avatars, dots, and toggle _thumbs_ are perfect circles (a lopsided circle looks broken); toggle _tracks_ take the cut; tabs use the magenta underline and no radius at all.

Gotcha: `overflow: hidden` clips correctly in CSS, but anyone cropping images in Figma needs to know the rule.

## Component notes

- **Chat:** the product speaks in magenta 100 bubbles; the customer stays neutral. The brand literally has a voice color.
- **Toasts:** dot + plain sentence + optional single text action. Severity lives in the dot color (green / magenta / red), so the body stays quiet.
- **Selection controls:** chosen things are green; the checkbox and toggle-on state use green 500. Focus rings are magenta (focus is pre-action).
- **Pricing cards:** the one component allowed both the 1.5px magenta border _and_ a filled magenta button — its whole job is to be the loudest thing on its page.
- **Errors:** softened red `#E24B4A`, outline treatments, plain language ("Square connection lost. Retry"). Red is so rare in this system that when it appears, it works.

## Copy register

Sentence case everywhere. Lowercase tracked labels are the only exception to sentence case, and they're a typographic treatment, not a capitalization rule. Verb-first buttons ("Start free pilot", "Confirm order"). No exclamation marks in system copy. Empty states are invitations, not apologies ("No orders yet tonight. They'll appear here the moment someone starts a chat.").

## The mark

The logo is the design system made vegetable, built from three moves:

- **The bulb** is the leaf-cut geometry at brand scale, drawn with type-matched curves: cubic corners with handles at ~0.8 (versus a circle's 0.55), giving flatter sides and fuller shoulders that echo Bricolage Grotesque's letter bowls. The mark should read like a character that could belong to the typeface.
- **The root** is an integrated curved taper flowing out of the bottom-left corner — part of the bulb's own path, one continuous fill, no stroke. Same position as the sharp corner in every UI component.
- **The leaf** is abstracted to the live dot. A green circle (r=10) cradled in a concave scoop cut from the top-right shoulder. The scoop arc is _concentric with the dot_ (arc r=15, centered on the dot), producing a uniform 5-unit negative-space gap. The dot is the same "green means alive" signal the product uses — the logo and the UI share a vocabulary.

Construction summary: soft body, one taper, one live dot. Nothing floats except the dot, and the gap is what makes it deliberate.

**Colors:** light mode — bulb `#E0399E`, dot `#3CC347`. Dark mode — bulb `#EA5CB1`, dot `#4DE659` (the electric stop's one appearance outside product UI).

**Lockup rules:** wordmark in Bricolage Grotesque 700, "purple" in text-primary, "radish" in magenta. The name stands alone — no domain suffix in the lockup. Alignment: the bulb's top shoulder sits at the wordmark's x-height; the dot breaks above the line like a tittle.

**Files:** `brand/logo.svg`, `brand/logo-dark.svg`, `brand/logo-mono.svg` (single-color, `fill="currentColor"` — inherits whatever text color surrounds it, for partner strips, press pages, engraving, or anywhere the palette isn't available), `brand/favicon.svg` (recentred crop, identical geometry), `brand/lockup.svg`, `brand/lockup-dark.svg`, and `brand/lockup-mono.svg` (live SVG text — requires Bricolage Grotesque loaded, or convert text to outlines for contexts without webfonts). Mono rule: the mark goes all one color, dot included — the concentric gap keeps the dot legible; never recolor just the dot.

## Quick self-review before shipping a screen

1. Count the filled magenta elements. More than one? Demote.
2. Is `#4DE659` on a light surface? Move it to the 500/600 stops.
3. Any bold inside a paragraph? Swap for magenta italic.
4. Any number, price, or time in Schibsted? Switch it to mono.
5. Any 16–20px text? Decide: is it a 21 or a 14?
6. Is the sharp corner anywhere other than bottom-left? Fix it.
7. Does anything use color without meaning act, alive, or done? Cut it.
