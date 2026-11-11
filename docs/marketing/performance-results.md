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

