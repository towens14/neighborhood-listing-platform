\# Lab 7: Media Performance Results



Date: November 10, 2026

Project: Neighborhood Listing Platform

Branch: lab7/media-marketing-copy



\## Lighthouse Results



Environment: Local Next.js development server

URL: http://localhost:3000

Test: Lighthouse mobile navigation



| Metric | Result |

|---|---|

| Performance | 99/100 |

| Accessibility | 100/100 |

| Best Practices | 96/100 |

| SEO | 91/100 |

| Largest Contentful Paint | 1.6 seconds |

| First Contentful Paint | 0.8 seconds |

| Total Blocking Time | 80 ms |

| Cumulative Layout Shift | 0 |

| Speed Index | 0.8 seconds |



\## Existing Media Optimization



The previous digital asset audit documented:

\- Responsive WebP property images

\- Optimized SVG sponsor and navigation graphics

\- Explicit image dimensions

\- Appropriate alt text

\- Responsive image selection



\## Limitations



Measurements were taken from the development server.

Chrome extensions affected the Lighthouse run.



A comparable pre-optimization Lighthouse baseline

has not been recorded.



Before-and-after page-weight and LCP comparisons

remain pending.



\## Remaining Tests



\- Missing-image fallback behavior

\- Slow-network loading behavior

\- Production performance comparison

\## Slow-Network Test



Date: November 10, 2026

Browser: Google Chrome

Environment: Next.js development server

Network Throttling: Slow 4G

Cache: Disabled



\### Results



\- Network requests: 25

\- Transferred data: 1.2 MB

\- Total resources: 4.0 MB

\- Network finish time: 8.85 seconds

\- DOM Content Loaded: 1.33 seconds

\- Property images displayed successfully

\- Visible image requests returned HTTP 200

\- Listing text and navigation remained usable



\### Observations



The homepage remained functional under Slow 4G.



Several property images were loaded as JPEG files

from Unsplash rather than optimized local WebP assets.



Further image optimization is recommended.



Test Status: PASS for observed image loading.

Layout stability under throttling was not separately measured.

\## Missing-Image Test

\### Fallback Verification



\- Placeholder SVG: PASS

\- Manual image error event: PASS

\- Placeholder displayed inside property card: PASS

\- Property details remained visible: PASS

\- Automatic fallback during blocked network request:

&#x20; NOT YET PASSING



Observation:

The React onError handler successfully displays

the placeholder when an error event is triggered

after hydration.



However, the automatic fallback did not appear

when the image request was blocked during page load.



Further work is needed to handle image failures

that occur before React hydration completes.





Date: November 10, 2026

Browser: Google Chrome

Environment: Local Next.js development server



\### Test Procedure

1\. Blocked the original property image using Chrome DevTools.

2\. Refreshed the homepage.

3\. Observed the missing-image behavior.

4\. Added an onError fallback to PropertyCard.tsx.

5\. Created property-placeholder.svg.

6\. Verified the placeholder loads directly in Chrome.



\### Results

\- Original image failure: Reproduced

\- Fallback SVG: Loads successfully

\- Alternative text: Property photo unavailable

\- Image aspect ratio: 4:3

\- Production build: PASS

\- ESLint: PASS



\### Conclusion

The placeholder asset loads successfully.

Final in-card fallback verification is pending.


## Production follow-up

Compared the local production homepage from `main` at `7362ea1` with the Lab 7 follow-up. Sizes below are response body bytes. The shell comparison fetches the HTML and each unique CSS or JS URL referenced in the HTML without compression. It excludes images, headers, and browser-initiated requests.

| Measurement | Before | After |
| --- | ---: | ---: |
| Sunny bungalow photo, original JPEG versus 384 px WebP | 90,371 B | 11,238 B |
| Sunny bungalow photo, original JPEG versus 768 px WebP | 90,371 B | 31,128 B |
| Production HTML and referenced CSS/JS | 602,038 B | 709,136 B |

The two WebP choices reduce the individual photo body by 87.6% and 65.6%, respectively. The broader branch increases the uncompressed HTML/CSS/JS total by 107,098 B. These measurements cover different resource sets. The browser’s full transferred page weight and comparable production LCP remain unmeasured. The earlier 1.6 s development LCP and Slow 4G observation are retained above.

The homepage now uses the Sunny bungalow WebP variants. Vitest covers an image already broken when React attaches the element and an error fired after render. Both tests pass and verify the local fallback; the first also checks that the listing title stays visible and the broken responsive source set is cleared. A Chromium startup restriction prevented the blocked-request browser retest. ESLint and the Next.js production build pass. Run the test suite with `npx vitest run --environment jsdom` (14 tests).
