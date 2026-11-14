# Digital Asset Pipeline & Performance Audit

**Project** · Neighborhood Listing Platform\
**Page** · Properties homepage (`/`)\
**Tested build** · Assignment branch based on GitHub `main` at `7060a73`, tested locally

This build uses React and Vite. The components below use native JSX `<img>` elements with browser responsive image attributes and Tailwind CSS.

## A. Primary property listing photo

- **Source.** `public/images/sunny-bungalow-384.webp` and `public/images/sunny-bungalow-768.webp`, served under `/images/`. The local WebP files derive from the representative photo used in the Sunny bungalow demo card. [Source photo](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800)
- **Permission and proof.** The demo cites the Unsplash License for the source photo. The photo is representative of the listing category. [Unsplash License](https://unsplash.com/license)
- **Administrative approval.** Unverified. This card renders a frontend fixture. The checked-in `properties` migration defines `image_url` and `image_alt` and lacks an image approval field.
- **Purpose and alt.** Informational. `alt={property.imageAlt}` renders as `alt="Modern white house beside a swimming pool"`.
- **Responsive behavior.** The browser measured **356 CSS px** at 390 px and **382 CSS px** at 1280 px. At 1× device pixel ratio the browser fetched the 384 px WebP at both widths. At 2× on the 390 px viewport it fetched the 768 px variant.
- **Risk and optimization.** A full-size JPEG increases transfer size, particularly on mobile. Two local WebP variants and the `srcSet`/`sizes` attributes let the browser choose an image based on slot size and pixel density. `aspect-[4/3] w-full` gives the image box a stable aspect ratio.

```tsx
<img
  className="aspect-[4/3] w-full object-cover"
  src={property.imageUrl}
  srcSet={property.imageSrcSet}
  sizes={property.imageSrcSet && '(min-width: 1232px) 382px, (min-width: 1024px) calc((100vw - 80px) / 3 - 2px), (min-width: 768px) calc((100vw - 56px) / 2 - 2px), calc(100vw - 34px)'}
  alt={property.imageAlt}
/>
```

## B. Local business partner banner

- **Source.** `public/images/neighborhood-services-banner.svg`, served at `/images/neighborhood-services-banner.svg` in the Neighborhood Home Services sample promotion.
- **Permission and proof.** Original AI-assisted SVG made for the demo. The SVG source is included. Business-owner authorization is unverified because the promotion uses a sample sponsor.
- **Administrative approval.** The Supabase Table Editor shows a `public.sponsors` row named `Neighborhood Home Services (Demo)` with `status = 'approved'`. This is a sponsor-level approval. The homepage references the SVG directly, and the sponsor row has no verified link to the specific image file.
- **Purpose and alt.** Decorative. The adjoining heading, copy, and link convey the promotion. `alt=""` keeps screen readers from repeating that information.
- **Responsive behavior.** The browser measured **288 CSS px** at both 390 px and 1280 px.
- **Risk and optimization.** A banner with no reserved dimensions can shift nearby text. The `width={288}` and `height={108}` attributes reserve the aspect ratio. `max-w-full h-auto` constrains the artwork to its container. The SVG uses simple vector paths, and `loading="lazy"` allows the browser to defer loading the banner when it is farther down the page.

```tsx
<img
  src="/images/neighborhood-services-banner.svg"
  alt=""
  width={288}
  height={108}
  className="my-3 h-auto max-w-full"
  loading="lazy"
/>
```

## C. Properties UI icon

- **Source.** `public/images/properties-icon.svg`, served at `/images/properties-icon.svg` next to the Available properties heading.
- **Permission and proof.** Original AI-assisted house icon made for the demo. The vector source is checked in at the path above.
- **Administrative approval.** No database approval record was verified. This is a static UI asset referenced directly by the homepage.
- **Purpose and alt.** Decorative. The heading already names the section, so the icon uses `alt=""`.
- **Responsive behavior.** The browser measured **20 CSS px** at both 390 px and 1280 px.
- **Risk and optimization.** Late sizing can move the heading text. The `width={20}` and `height={20}` attributes reserve the icon box. The SVG scales cleanly on high-density displays without a separate bitmap.

```tsx
<h2 id="listings-heading" className="flex items-center gap-2">
  <img src="/images/properties-icon.svg" alt="" width={20} height={20} />
  Available properties
</h2>
```

## Network telemetry

The Vite production build was served locally. Headless Chromium 153 captured image requests through the Chrome DevTools Protocol. Browser cache was disabled and the page was hard-reloaded for each viewport. The banner was scrolled into view so its lazy-loaded request completed. Transfer sizes use decimal KB and include response overhead. Content Download measures the interval from the end of response headers to request completion. These timings are for a local server with no throttling.

| Viewport | Asset | Rendered width (CSS px) | Requested image | Transferred (KB) | Content-Type | Content Download (ms) |
| --- | --- | ---: | --- | ---: | --- | ---: |
| 390 px, 1× | A | 356 | `sunny-bungalow-384.webp` | 11.506 | `image/webp` | 0.869 |
| 390 px, 1× | B | 288 | `neighborhood-services-banner.svg` | 0.973 | `image/svg+xml` | 1.561 |
| 390 px, 1× | C | 20 | `properties-icon.svg` | 0.503 | `image/svg+xml` | 1.493 |
| 1280 px, 1× | A | 382 | `sunny-bungalow-384.webp` | 11.506 | `image/webp` | 1.572 |
| 1280 px, 1× | B | 288 | `neighborhood-services-banner.svg` | 0.973 | `image/svg+xml` | 1.030 |
| 1280 px, 1× | C | 20 | `properties-icon.svg` | 0.503 | `image/svg+xml` | 1.806 |
| 390 px, 2× | A | 356 | `sunny-bungalow-768.webp` | 31.396 | `image/webp` | 1.966 |

All listed requests returned HTTP 200. `npm run build` and `npm run lint` passed.

To reproduce in Chrome DevTools, open **Network → Img**, select **Disable cache**, set the device toolbar width to 390 or 1280 px at DPR 1, and hard refresh. Scroll to the promotion. Read transferred KB from **Size**, the MIME type from **Headers**, and Content Download from **Timing**. Inspect each image in **Elements** for its rendered CSS width.

## Evidence still needed for the approval criterion

Asset B has a verified demo sponsor approval. An approval tied to the exact SVG and authorization from a real business partner remain unverified. Assets A and C still need matching approval records or instructor guidance on acceptable evidence for demo and static assets.
