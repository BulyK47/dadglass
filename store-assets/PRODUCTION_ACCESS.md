# Production access — draft answers

Google asks, in writing, how the closed test went. This is the form that decides
whether the app gets out of closed testing, so it is worth more care than the
listing copy.

**Everything below is written to be true.** Two conditions, though:

1. **Upload 1.0.6 to the closed track before submitting this form.** Answers 8
   and 9 describe changes made in response to tester feedback. They are real
   changes, in the code, but they only become *shipped* changes once the build
   is on the track the testers are using. Submit the form after that upload.
2. **Two answers are yours to pick** — questions 2 and 7 are opinion, and the
   numbers below are suggestions, flagged inline.

A note on the answers the testing provider supplied: their draft said, at
question 8, that the ASO, screenshots, walkthrough and rating button had already
been done. At the time nobody had done any of them. Three of the four are
verifiable by a reviewer in about a minute — the screenshots are on the listing,
the walkthrough and the rating row are in the APK — so the draft was not usable
as written. It is now accurate because the work exists.

---

### 1. How did you recruit users for your closed test? For example, did you ask friends and family, or use a paid testing provider?

```
I used a paid testing provider, which tested the app across a range of Android
devices and SDK versions and returned a written report. I am an individual
developer publishing my first app, so I did not have an existing user base to
recruit from.
```

*(Deliberately does not claim outreach to parenting communities. Say only what
happened.)*

### 2. How easy was it to recruit testers for your app?

```
Difficult
```

**Your call.** "Difficult" is the honest answer if the paid provider was the
route you took because finding twelve committed testers yourself was not
practical. If you would rather not editorialise, "Neutral" is also defensible.
This answer is not what the decision turns on.

### 3. Describe the engagement you received from testers during your closed test

```
Testers installed the app and used it across several devices and Android
versions, covering all five sections: the weekly guide, the week-by-week
journey, the checklist, the handbook and the profile, plus the feature screens
(hospital bag, appointment notes, reminders, journal). They reported no crashes
and no functional defects. The substance of their feedback was about
presentation and first-run experience rather than stability, and it was specific
enough to act on directly — four concrete recommendations, all four of which I
implemented.
```

### 4. Provide a summary of the feedback that you received from testers. Include how you collected the feedback.

```
Feedback came as a written report at the end of the test period, covering device
and OS coverage, functionality, and store-readiness.

No crashes or functional bugs were found on any device or SDK configuration.

Four improvements were recommended:
1. The store listing was not written for search — the description carried no
   terms a user would actually type.
2. The screenshots were plain device captures with no explanation of what the
   app does, which is weak for conversion.
3. There was no walkthrough introducing the app's sections to a new user.
4. There was no way for a user to rate the app.

They also suggested a community forum, deeper editorial content, and periodic
content updates. I declined the forum: the app has no accounts and no server,
stores everything on the device, and my Data safety declaration says no data is
collected. Adding a forum would mean accounts, hosting, and user-generated
content moderation, and would make that declaration untrue. The other two are
reasonable and are on my list after launch.
```

### 5. Who is the intended audience for your app?

```
Expecting fathers and partners — adults preparing for the birth of a child.
Primarily first-time dads, who are the group with the least idea of what to
expect and the fewest resources aimed at them. The app is bilingual (English and
Romanian); Romania is the initial market.
```

### 6. Describe how your app provides value to the users.

```
Most pregnancy apps are written for the pregnant person. DadGlass is written for
the partner, and answers the question that person actually has each week: what
is happening, what she may be feeling, and what I can usefully do about it.

It contains a week-by-week guide for weeks 4 to 40, a size comparison that makes
the baby's growth concrete, a 51-task checklist sorted by trimester and priority
with reminders that export to the user's own calendar, a detailed hospital bag
list, questions worth asking at appointments with somewhere to save the answers,
conversation prompts for decisions the couple should make together, plain-language
guides to labour, birth plans and the postpartum weeks, and a private journal.

It works fully offline, has no account, no ads and no in-app purchases, and
stores everything on the device. Medical content is educational only, states that
it is not medical advice, and points the user to a doctor or midwife for anything
clinical.
```

### 7. How many installs do you expect your app to have in your first year?

```
1,000 - 10,000
```

**Your call.** The provider's draft said 10k–100k. For a first app by a solo
developer, in two languages, with no marketing budget and aimed at a narrower
audience than pregnancy apps generally, the lower band is the honest estimate.
Google does not reward optimism here, and an inflated number is the kind of thing
that makes the rest of the form read as boilerplate.

### 8. What changes did you make to your app based on what you learned during your closed test?

```
All four recommendations are implemented, together with a further defect I found while
testing on a real phone: on several screens the app was drawing underneath the status bar
and the Android navigation buttons. Everything below ships as version 1.0.6:

1. Store listing rewritten for search. The short description now leads with the
   terms users search for, in both languages, and the opening of the full
   description carries them in normal sentences. The medical disclaimer stays in
   the first paragraph, as the Health apps policy requires.

2. Screenshots replaced. All ten (five per language) now carry a headline and a
   one-line explanation above the device image, each showing a specific feature
   rather than a generic screen.

3. A walkthrough added. New users now see a five-step introduction to the app's
   sections after setup, with a skip option, and it can be reopened at any time
   from Profile.

4. Rating added. Profile has a "Rate on Google Play" entry that opens the store
   listing, and the app asks Play once to show its in-app review dialog after the
   user has actually got something out of the app — ten checklist items completed
   or three journal entries written. Per Play's guidelines the in-app flow is not
   triggered by a button and the user is not asked any qualifying question first.

Reviewing the app again while making those changes turned up four more things,
all in the same release:

5. The home-preparation list recommended an anti-roll positioning pillow, which
   contradicts safe-sleep guidance (AAP, NHS / The Lullaby Trust) on what belongs
   in a cot. It is removed, and the list now states what to keep out of the cot.

6. The hospital bag and home lists were expanded from real maternity paperwork
   and reviewed: brand names removed, and a standing note added saying the lists
   are general, the maternity's own list takes precedence, and anything involving
   medication or treating the baby comes from a doctor, midwife or pharmacist.

7. An onboarding question ("is this your first baby?") was collected and never
   used anywhere in the app. It is removed rather than left as a decision that
   bought the user nothing.

8. Profile displayed a hardcoded version number that no longer matched the build.
   It now reads the real version, and the release checks fail if the two disagree.
```

### 9. How did you decide that your app is ready for production?

```
Three things together.

No stability problems: the closed test found no crashes or functional defects
across the devices and SDK versions covered.

Everything raised was addressed. All four tester recommendations are implemented
and shipped, not deferred, and the review that went with them caught four further
issues — including one safe-sleep item that mattered more than any of the
original four.

The release checks pass. The project has a repeatable pre-release audit script
covering the privacy policy and its public URL, the medical disclaimer in both
languages, the app ID, permissions, icons and asset integrity, and version
consistency. It currently reports zero blocking problems and two
warnings, both of which are reminders rather than defects: that the signing keystore
present on the build machine must never be committed, and that the published privacy
policy only reaches the store's URL once GitHub Pages has redeployed.
```

### 10. What did you do differently this time?

```
Not applicable to a first submission.
```

**Only answer this if the form actually asks it.** Google shows it when you are
re-applying after a previous production-access request was turned down. If this
is your first application, the question should not appear; if it does, answer it
in terms of what changed since the previous attempt, not in the general terms the
provider's draft used.

---

## Before you submit

- [ ] 1.0.6 (versionCode 7) uploaded to the closed testing track
- [ ] New listing copy pasted in, EN and RO, disclaimer still in the first paragraph
- [ ] Ten captioned screenshots uploaded from `screenshots/{en,ro}/` — **not** the
      uncaptioned ones under `raw/`
- [ ] Questions 2 and 7 answered with your own numbers
- [ ] Question 10 left out unless the form asks it
