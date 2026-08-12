# Design QA

## Visual target

- Source of visual truth: `/Users/mac/.codex/generated_images/019ff592-e009-76f3-a8cc-14897c5055a9/exec-09e70daf-47bb-446f-a5d1-8124cdb9ac4d.png`
- Source pixels: 1487 × 1058
- Source CSS comparison size: 1487 × 1058
- Source density: 1×
- Implementation: `http://127.0.0.1:4322/` from the production build
- Implementation screenshot: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-home-desktop.png`
- Implementation pixels: 1487 × 1058
- Implementation CSS viewport: 1487 × 1058
- Implementation density: 1×
- State: homepage at the top, settled entrance/reveal motion, no hover state, navigation closed

## Comparison evidence

- Full above-the-fold comparison input: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-home-comparison.png`
- Focused hero comparison input: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-hero-comparison.png`
- Mobile About evidence: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-about-mobile.png`
- Work evidence: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-work-desktop.png`
- Experience evidence: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-experience-desktop.png`
- Contact evidence: `/Users/mac/Documents/Projects/my-portfolio/tmp/design-qa/final-contact-desktop.png`
- Credway source capture: `/Users/mac/Documents/Projects/my-portfolio/tmp/credway-audit/01-home-viewport.png`
- Credway portfolio evidence: `/Users/mac/Documents/Projects/my-portfolio/tmp/credway-audit/03-work-desktop.png`
- Mobile motion/work evidence: `/Users/mac/Documents/Projects/my-portfolio/tmp/credway-audit/06-home-mobile.png` and `/Users/mac/Documents/Projects/my-portfolio/tmp/credway-audit/09-work-mobile-project.png`

The source and implementation were normalized to the same 1487 × 1058 viewport before judging typography, hero composition, portrait scale, connectors, CTA treatment, divider position, and the start of selected work. A second combined input isolates the hero because identity, portrait treatment, and hand-drawn connectors were the highest-risk details.

## Findings

- Typography, warm editorial palette, taped portrait, dot field, CTA shape, blue annotations, divider, and selected-work composition follow the approved second direction.
- Intentional product/content deltas: Fraunces replaces the reference display font at the user's request; the wordmark uses Kene instead of the full name; the positioning is Senior Software Engineer with Head of Engineering explained as current experience; real project imagery and copy replace concept placeholders.
- The background is a quieter neutral paper tone and page labels use restrained body typography, reducing the template-like blue-handwriting repetition without abandoning the selected design system.
- Real project images are standalone, proportionally contained, and unframed.
- Credway is included in the full Work catalogue and has its own generated case-study route, while the homepage remains limited to the three selected features.
- Motion now has three distinct levels: a staggered homepage entrance, project/section scroll reveals, and Astro page transitions. The project reveal visibly resolves from a 38-pixel translated, clipped, 0.975-scale state to its settled state in 760 milliseconds.
- No horizontal overflow at 1487, 1280, 1024, or 410 CSS pixels. The one 4-pixel About overflow found during the mobile pass was corrected by constraining the decorative dot field.
- No actionable P0, P1, or P2 visual issues remain.

## Comparison history

1. P1 — Homepage project imagery was framed and oversized. Removed the containers and constrained images to a 620-pixel maximum width and 310-pixel maximum height. Verified in `final-home-comparison.png`.
2. P1 — The selected direction's connector arrows and project-title arrows were missing. Added real Bootstrap Icons assets for both hero annotations and all project-title links. Verified in `final-hero-comparison.png` and the browser DOM.
3. P1 — Work, About, and Experience headings could crop near the previous tablet breakpoint. Moved the shared responsive layout breakpoint to 1080 pixels and verified every primary page at 1024 × 820 with no overflow.
4. P1 — Mobile About had a 4-pixel overflow from the decorative dot field. Constrained the field at the small breakpoint; final measurement is 410 scroll width / 410 client width.
5. P2 — Experience repeated two large introductions before the role history. Replaced the second introduction with three evidence-led career highlights and a compact list heading.
6. P2 — Identity and role copy over-positioned leadership. Changed the primary title to Senior Software Engineer and retained Head of Engineering as factual current experience.
7. P2 — Contact styling and information hierarchy were less aligned with the portfolio system. Added direct email, switched the submit CTA to the shared ink treatment, and kept accessible success/error feedback.
8. P1 — Scroll reveals were technically present but too quiet to register. Increased their travel and duration, added project-media clipping/scale and content staggering, and introduced a staggered hero entrance plus root page transitions. Reduced-motion overrides remain explicit.
9. P2 — Credway was missing from the recent-work record. Audited the live `credway.com.ng` homepage, added the real capture, factual project metadata, and `/work/credway` without promoting it into homepage features.

## Responsive and interaction checks

- Desktop pages checked at 1280 × 720 and the source-matched homepage at 1487 × 1058.
- Tablet pages checked at 1024 × 820; all headings remained within the viewport and all document scroll widths equalled client widths.
- Mobile pages checked at 410 × 888; hero CTAs stack to 378 pixels, the global 16-pixel gutter is preserved, and all pages are overflow-free.
- Mobile menu: open state set `aria-expanded=true`, opened navigation, and locked body scroll; close state reversed all three.
- Homepage CTA: `See my work` settled at `#selected-work` with the section at the top of the viewport.
- Project images, titles, case-study links, primary navigation, resume link, and contact links resolve to real routes/assets.
- Browser identity: the current portrait cutout loads from `/kene-codehermit-favicon.png`; the homepage title is `Kene · CodeHermit — Senior Software Engineer`, and internal page titles retain the same `Kene · CodeHermit` suffix.
- Contact form contract: POST to `/api/contact`, four required fields, email input type, honeypot, submit button state, and ARIA live status region are present.
- Live Netlify endpoint verification: a clearly labelled verification message returned HTTP 200 with `{"ok":true}`, confirming the deployed database submission path accepts and stores messages. The new frontend uses the same endpoint contract.
- Production build: 14 routes generated successfully, including `/work/credway`.
- Browser console: no warnings or errors on the final homepage pass.

final result: passed
