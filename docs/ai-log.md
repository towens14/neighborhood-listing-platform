# AI Provenance Journal

| Step / Tool | Prompt Summary | Model Output Used | Model Output Rejected & Rationale | Verification Method | Associated Git Commit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Part 1 / ChatGPT | Exact prompt: “i thought we already did this” | Reused the workflow and requirements from the earlier exam branch and added the missing ignore rules. | Rejected continuing on `exam/merchant-booking` because the rubric names `exam/services-booking-eval`. | Student confirmed the branch, both copied files, and all five `git check-ignore` results in Git Bash. | Add after committing. |
| Part 2 / ChatGPT | Continued from the terminal screenshot confirming Part 1 progress. | Adapted the merchant and resident stories and added the administrator story, scope estimates, and traceability. | Replaced the earlier authenticated-only booking and customer booking-read criteria to match the Version B access rules. | Review against the rubric now. Verify the linked SQL and routes when implemented. | Add after committing. |
