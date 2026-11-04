| Stakeholder | Known from the assignment | Assumptions to test |
| --- | --- | --- |
| **Property professional** | The platform includes property listings and requires a workflow for approving listing content. | The property professional may need to preview edits, see who approves them, and check whether a listing is ready to publish. |
| **Local sponsor** | The platform includes local sponsors and requires a workflow for approving sponsor claims. | The sponsor may want to preview where their promotion appears, know who approves it, and measure success through clicks or inquiries. |

## Draft Value Proposition

The platform helps property professionals present listings and local sponsors share promotions with people browsing those listings. The proposed approval workflow lets each group check its content for accuracy before it goes live. Discovery will help us determine who should approve each type of content, what would make the workflow accessible, and how each group would measure success.

## Discovery Interview Guide

1. Walk me through how you prepare a property listing or local promotion to share today.
2. Who are you trying to reach, and what information do they usually need?
3. What, if anything, takes the most time or effort in your current workflow?
4.  Who, if anyone, reviews your content before it goes live? If someone does, what do they usually check?
5. How do you handle corrections or updates after content is published?
6. How, if at all, do you track or evaluate how a listing or promotion performs?
7. What barriers, if any, make it harder for you to create, review, or publish content?
8. What barriers, if any, might your audience encounter when reading or interacting with that content?

## Interview Invitation and Consent

**Draft for instructor review. For this assignment, we plan to use a simulated interview.**

### Invitation

Hi, I’m a Cal State LA student working on a class project about how property professionals and local sponsors prepare, review, and publish content. I’d like to invite you to a 15-minute interview about your workflow. Taking part is voluntary.

With your permission, I’ll take brief notes without your name or identifying details. Our team will use those notes to develop project requirements. De-identified themes and requirements may appear in our class submission and GitHub repository. The interview will not be recorded.

### Consent

Before we start, do you agree to participate and allow me to take brief, de-identified notes for the uses described above? You can skip any question or stop at any time. I’ll proceed only if you agree.

## Simulated Interview Notes

ChatGPT generated these fictional role-play responses for a class exercise.
No stakeholders were contacted. The responses are assumptions to validate
with real stakeholders.

### Property Professional

- **PP-01 (Q1–Q3):** I collect the property details and photos, draft the listing, and post it online. I’m trying to reach people looking for a home nearby. They usually ask about price, availability, and amenities. The most time-consuming part is checking that the details match across the places where I post.
- **PP-02 (Q4–Q5):** I usually review my own listings. If a detail is unclear, I ask the property owner to confirm it. If availability changes after publication, I edit the original listing and update the other places where I shared it.
- **PP-03 (Q6–Q8):** I judge success by whether the listing leads to relevant inquiries or tour requests. I usually check listings on my phone, where a cramped edit screen makes details easy to miss. For readers, putting the rent or contact information only in an image makes it harder to find and can make it inaccessible to someone using a screen reader.

### Local Sponsor

- **LS-01 (Q1–Q3):** I write a short offer, pick a photo, and share it on social media. I’m trying to reach people who live or shop nearby. They usually want to know what the offer includes, when it ends, and where they can use it. I spend the most time rewriting the offer to fit different formats.
- **LS-02 (Q4–Q5):** I check the price, dates, and restrictions myself before posting. If someone else will publish the promotion, I want to preview it first. If the offer changes, I update the original post, but older copies can still circulate.
- **LS-03 (Q6–Q8):** I don’t track every promotion. For offers with a discount code, I can count how many people use it. On my phone, it’s hard to tell whether an uploaded image will be cropped. Customers may miss the expiration date if it appears only in small text on the graphic.

## Interview Themes and Candidate Requirements

These findings come from simulated interviews. Each candidate requirement is an
inference to validate with real stakeholders.

| Theme | Supporting notes | Candidate requirement (inference) | What to confirm |
| --- | --- | --- | --- |
| Keeping content consistent across channels | PP-01, PP-02, LS-01, LS-02 (both roles) | Allow users to edit a single saved listing or offer and copy its current details for reposting. | Which channels do users update, and would copying, exporting, or automatic syncing fit their workflow? |
| Formatting and previewing promotions | LS-01, LS-02, LS-03 (local sponsor) | Show the sponsor a mobile preview of the offer and its image crop before publication. | Which placements need previews, and do sponsors need manual crop controls or formatting templates? |
| Editing on a phone | PP-03, LS-03 (both roles) | At a 360 px viewport, display key fields and image controls without horizontal scrolling. | Which editing tasks do stakeholders perform on phones, and which screen sizes should be tested? |
| Accessible listing and offer details | PP-03, LS-01, LS-03 (both roles) | Display rent, contact details, offer restrictions, and expiration dates as readable text when applicable, even when an image is attached. | Which fields should be required, and would an accessibility reminder help during publishing? |
| Updating published content | PP-02, LS-02 (both roles). LS-02 specifically mentions older copies circulating. | After an edit is published, show the latest approved details on the platform page. | Would an updated timestamp, expiration notice, or list of places where the content was shared help? |
| Measuring results | PP-03, LS-03 (both roles) | Show a count of tour requests per listing. Evaluate redemption tracking for sponsors who use discount codes. | Which actions count as success, and how could the platform reliably capture them? |

## AI Provenance Log
### Gemini — Interview question review
- Prompt: Review these eight interview questions for a student project. Flag any leading wording, unsupported assumptions, or requests for sensitive information. Suggest neutral rewrites only where needed, and explain each change briefly.## Discovery Interview Guide

1. Walk me through how you prepare a property listing or local promotion to share today.
2. Who are you trying to reach, and what information do they usually need?
3. What, if anything, takes the most time or effort in your current workflow?
4. Who, if anyone, reviews your content before it goes live, and what do they check?
5. How do you handle corrections or updates after content is published?
6. How do you tell whether a listing or promotion achieved what you wanted?
7. What barriers, if any, make it harder for you to create, review, or publish content?
8. What barriers, if any, might your audience encounter when reading or interacting with that content?
- Useful output: Gemini suggested making the follow-up in Q4 conditional on having a reviewer and adding “if at all” to Q6 so participants can say they do not track performance. I used both revisions.
- Rejected or revised output: I did not adopt Gemini’s claim that Q4 assumed everyone had a reviewer. The original already said “if anyone.” The revision clarifies when to ask the follow-up.
- Verification: I compared the revisions with the original questions and checked that the guide still covers workflow, audience, content approval, success measures, and accessibility without requesting sensitive personal information.
- Commit: [Add the link after committing the revised guide.]


Analyze the simulated interview notes below for a student project about
a property listing and local sponsor platform.

Create a table with four columns:
Theme | Supporting note IDs | Candidate requirement | Uncertainty

For each row:
- Cite the note IDs that support the theme.
- Say whether the theme appears in both roles or only one.
- Label any interpretation beyond what the notes explicitly say as “Inference.”
- Suggest a testable requirement and identify what a real stakeholder
  would need to confirm.

Do not invent quotes, facts, or stakeholder claims. Treat these notes as
fictional role-play, not evidence from real interviews.

Simulated interview notes:
[Replace this line with all six notes.] 

### Google AI Studio — Theme analysis

- **Prompt:** [Paste the exact prompt you ran, including the six simulated notes.]
- **Useful output:** The six themes and their initial links to the simulated notes.
- **Revised or rejected output:** Automatic syncing and third-party retraction were moved to stakeholder follow-up. The notes did not establish that formatting reduced promotion frequency, stale offers caused financial loss, or users preferred simple analytics. The 360 px viewport is a proposed test condition.
- **Verification:** ChatGPT compared all six rows with the original simulated notes. The revised table distinguishes the sponsor's stale-copy concern from the listing update workflow and adds LS-01 as the source for offer restrictions.
- **Commit:** [Add the link to the commit containing the revised theme table.]
