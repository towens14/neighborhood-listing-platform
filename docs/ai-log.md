# Week 2 AI Review Log

## Gemini review — PropertyCard

**Prompt used**

> Review this React component for semantic HTML, WCAG-oriented keyboard access, responsive behavior, and TypeScript safety. For each issue, give: the issue, why it matters, the smallest change, and a manual test. Do not claim compliance from code alone.

**Useful feedback**

- Add padding around the property details.
- Use `mt-auto` on the listing link to help align links when cards have different content heights.
- Check the heading in the context of the full page and confirm `imageAlt` exists in the `Property` type.

**Feedback not adopted as written**

Gemini suggested replacing the link text with “Explore details” and an `aria-label` because the links might sound repetitive. I kept “Explore homes near [address]” because each card’s link includes its property address, making the links distinguishable in this sample.

**Verification and changes**

- Checked the page structure: the page has an `<h1>`, the listings section has an `<h2>`, and each property title uses an `<h3>`.
- Confirmed that `imageAlt` is included in the `Property` type.
- Added a padded details container and `mt-auto` to the link.
- Viewed the page in the browser and confirmed the card details have padding.
- Ran `npm run lint` and `npm run build`; both passed.
- Responsive widths of 375 px, 768 px, and 1280 px were checked earlier and recorded in the pull request. I did not repeat those width checks after this spacing change.
- I did not perform a screen-reader test for this review.

**Commit:** `5fbb91b` — Add spacing to property card details

## ChatGPT review

I shared Gemini’s review and the `PropertyCard` code with ChatGPT. It helped compare the suggestions with the project code, identified which feedback to apply, and explained how to verify and record the change. The heading hierarchy and `imageAlt` field were checked against the project; padding and link alignment were applied and visually checked in the browser.