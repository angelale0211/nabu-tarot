# App Review preparation — learning workflow, 28 October 2026

The only rejection supplied for this work is Guideline 4.3(b), concerning a saturated fortune-telling category. The generic Extended Review paragraph does not identify a separate security defect. Google Play has already accepted the app according to its owner. These changes retain the existing reading and fortune-telling features; they do not guarantee App Store acceptance.

## Notes to adapt after the release is deployed and tested

Replace [version/build] with the build selected in App Store Connect. Do not claim the reviewed binary contains these changes until checked on an iPhone. The Flutter shell in this repository loads https://nabutarot.com/; a branch preview alone does not change the version Apple sees.

> We have revised Nowtaro / Nabu Tarot in response to Guideline 4.3(b). In [version/build], the home screen presents two visible paths: Draw & read and Learn & practise. Existing readings remain available. We would like the review to consider the following learning workflow alongside those readings.
>
> 1. Open Home → Learn & practise → a suggested free exercise. Read the scenario, reveal the cards, and write an interpretation and the reasoning behind it.
> 2. Submit the interpretation. The app saves the actual writing and shows automatic keyword/position feedback, position-specific prompts and a reference interpretation. The automatic checker is rule-based; it is not human marking or a measure of predictive accuracy.
> 3. Open Self-review and revision plan. Assess the interpretation against four criteria and record what to revise. This self-assessment is kept separate from the automatic feedback.
> 4. Revise the attempt, then open Study notebook → the exercise to compare the original and revised writing with their saved feedback. The original is preserved.
> 5. Return to the practice pathway and choose a skill: meaning/evidence, card position, reversals, synthesis or interpretation limits. Suggested next exercises account for that skill, previous attempts and course access.
>
> The notebook also supports card-linked reflections, JSON export and validated restore. These records stay on the device, separated by account or guest. A learner may preview a request for feedback from Nabu, consent to sharing it and open an editable private message; nothing is sent until they press Send. This does not promise a response time or free personal marking.
>
> The workflow is available in Vietnamese, English and German and is part of the normal app experience. Please let us know which aspects of this experience you consider insufficiently differentiated under 4.3(b), so we can respond to the specific concern.

## Before sending

- Merge and deploy the reviewed changes, then confirm the actual iPhone app loads web/cache version **v293**, including its hashed workshop script. This PR is not a TestFlight submission.
- Repeat the five steps above on the exact build, check all three languages, relaunch with and without connectivity, and test local persistence and backup import/export. Lazy practice/workshop modules must have been opened online before they can be used from cache offline.
- Check sign-in, account switching, logout/deletion, purchases and restore purchases on iPhone with appropriate review/sandbox accounts. Windows browser tests do not verify StoreKit or native sharing.
- Supply current reviewer credentials and explain how reviewers can access any paid courses. The free exercises are available without a purchase.
- Capture actual iPhone screens showing the scenario, reasoning, self-review and comparison; describe those implemented features accurately in screenshots and metadata. Do not hide fortune-telling features or claim exclusivity that has not been established.
- Keep the reply in the existing App Review thread and identify the new version/build. No refund request or appeal has been sent by this change.

## Validation and remaining scope

Local validation: 1,003 existing browser checks, 35 focused interaction checks, 8 static checks, notebook storage tests, workshop backup/account/access tests, and AI report acknowledgement/failure/timeout tests. Manually exercised the Vietnamese learning workflow at a 390 × 844 viewport.

AI reports now show success only after server acknowledgement, with a retryable unconfirmed state on failure or timeout. Optional mentor messages keep their editable draft after a send failure. These are specific fixes, not a claim that every security issue has been audited or resolved. Community comment pre-moderation and operational response to reports remain separate work; this change does not introduce a server moderation queue.

Apple's decision depends on the complete submitted experience: [App Review Guidelines, 4.3](https://developer.apple.com/app-store/review/guidelines/#spam).
