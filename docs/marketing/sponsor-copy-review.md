# Lab 7 Sponsor Copy Review

Team A — Aster · Tavia Owens · Neighborhood Listing Platform

## Sponsor brief

The supplied classroom scenario identifies Aster Neighborhood Services as a fictional residential cleaning business in Los Angeles. No offer, street address, campaign dates, or sponsor URL was supplied. The asset provenance and alt-text notes are in the [asset audit](../digital-asset-pipeline-audit.md).

## Prompt and review

The generation prompt recorded for ChatGPT requested three blurbs using only supplied facts, each under 120 characters, with a fact-to-phrase trace. It prohibited invented facts, superlatives, discounts, guarantees, urgency, and demographic targeting. ChatGPT reviewed the three results for unsupported and discriminatory wording. Gemini independently reviewed them in Google AI Studio on November 10, 2026 for factual fidelity, wording, and length.

| Raw draft | Characters | Fact-to-phrase trace | Review |
| --- | ---: | --- | --- |
| Aster Neighborhood Services provides residential cleaning in Los Angeles. | 73 | “Aster Neighborhood Services” → name, “residential cleaning” → service, “Los Angeles” → location | ChatGPT and Gemini passed factual and wording checks |
| Looking for residential cleaning? Learn about Aster Neighborhood Services in Los Angeles. | 89 | “Aster Neighborhood Services” → name, “residential cleaning” → service, “Los Angeles” → location | ChatGPT and Gemini passed factual and wording checks |
| Explore residential cleaning services from Aster Neighborhood Services in Los Angeles. | 86 | “Aster Neighborhood Services” → name, “residential cleaning” → service, “Los Angeles” → location | ChatGPT and Gemini passed factual and wording checks |

All three variants are useful classroom drafts. Neither review identified a sentence that needed rejection. Gemini recorded no publication authorization for any variant. The draft copy and model reviews are kept in this document outside the application’s runtime copy.

## Human approval and publication

| Copy | Status | Human approver | Approval date |
| --- | --- | --- | --- |
| Aster variants 1–3 | Draft for publication | No verified publication approval | No recorded date |

The original review records asset/copy publication authorization separately from model review. The application uses the same validation function at the API and banner for status, human approver, approval date, offer end date, and the 120-character maximum. The API validates payloads and does not publish them. The homepage has no approved Aster promotion. The automated approved test record is synthetic and the banner labels that display state “Sponsored Advertisement.”

If a claim is wrong, the designated content administrator withdraws the published copy immediately. Record the affected wording and correction, put the revision in draft, verify it against the sponsor facts, and record a fresh human approval before republication.

## Verification and attribution

- Original media and sponsor validation implementation and documented AI reviews are in commit [4511654](https://github.com/towens14/neighborhood-listing-platform/commit/45116540928d30326e7e7c6a6a66502686442900).
- The [performance record](performance-results.md) contains the slow-network observation, production byte comparison, and fallback test results.
- [Pull request #20](https://github.com/towens14/neighborhood-listing-platform/pull/20) documents Tavia Owens’s individual contribution.
