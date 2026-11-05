> **LOCKED governing file.** Do not edit in place. See `GOVERNANCE.md`.

# Competition facts: single source of truth

Every other doc **links here** rather than restating a date, time, requirement or weight. If you find a duplicate elsewhere, delete it and replace it with a link.
**Always write times with a timezone.** A bare time with no timezone has caused real missed submissions. Everything below is **IST** (India Standard Time, UTC+05:30) unless stated.

Source: section "Mumbai rules and schedule" of `docs/research/ETHGlobal_Mumbai_Research_Handover.md` (dated Nov 5, 2026; frozen). The handover rates these facts High trust,
read from the ETHGlobal site and the finalist email. Dashboard state there was last read Oct 27; **re-check the live ETHGlobal pages and the email before relying on any line.**
Anything not in that section is `TODO(Dhruv)`.

## Event
| Field | Value |
| --- | --- |
| Name | ETHGlobal Mumbai (part of Devcon Week) |
| Host | ETHGlobal |
| Dates | Nov 5-7, 2026 |
| Venue | Jio World Convention Centre, Jio World Centre, G Block, Bandra Kurla Complex, Bandra East, Mumbai 400098 |
| Event link | TODO(Dhruv) (not in the source section) |
| Prize pool advertised | $175,000 (site also advertises 800+ attendees, 11+ protocols, 29+ workshops) |

## Deadline
**Project submissions due Sat Nov 7, 2026, 09:00 IST. Late entries are not accepted.**

| Date | Time (IST) | Item |
| --- | --- | --- |
| Thu Nov 5 | 20:00 | Welcome and opening ceremonies |
| Thu Nov 5 | 21:30 | Team formation and idea brainstorming |
| Sat Nov 7 | 09:00 | **Project submissions due** |
| Sat Nov 7 | 09:30 | Partner prize judging and main finalist judging start |
| Sat Nov 7 | 15:15 | Finalists notified |
| Sat Nov 7 | 15:30 | Closing ceremonies |

Main finalist judging: 180 minutes in the Live Judging Rooms. Partner judging: at Partner Booths.

## Finalist requirements (all four mandatory)
If the finalist email and the website differ, **follow the email** (newer and stricter).
1. **Live deployment** accessible to anyone with the link. A video, slide deck or similar link does not qualify.
2. **Demo video** on the project page: 2-4 minutes, at least 720p, audio without music. Uploads outside the limits fail.
3. **Every required field** in the submission form completed.
4. **Public GitHub repository.**

ETHGlobal will run secondary eligibility checks in the judging line.

Finalist email: "ETHGlobal Mumbai Finalist Prize Updates!" from Pascal at ETHGlobal, Oct 31, 2026. Tiers and travel money appear **in the email only** (not found on the website as of Oct 31):

| Team size | Prize per person | Travel reimbursement per person |
| --- | --- | --- |
| Solo | 250 USDC | None |
| 2 people | 250 USDC | 250 USDC |
| 3-5 people | 1,000 USDC | 500 USDC |

Travel money applies to one in-person ETHGlobal hackathon within 365 days. Our team has 3 members (3-5 tier).

## Submission and tracks
- **Submission options:** "Finalist and Partner Prizes" (requires presenting to judges) or "Partner Prizes Only" (does not). Choice: open, `Q-0004`.
- **From Scratch track:** all project work must begin after the event start. Earlier code, designs or assets are not allowed, except public libraries and starter kits. Earlier work can still take part but **cannot win partner prizes or finalist**.
- **Continuity tracks (Extend Open Source, Ship a Feature):** clearly document earlier work and include new features built at the event. Partner eligibility may vary.
- All teammates must be on the **same track**. Track choice: open, `Q-0003`.

## Partner prizes
- Select **up to 3** on the last submission step. All tracks from one partner count as 1 pick.
- Judged on submitted materials; visiting a booth is optional.
- For each partner prize: explain how you integrated the tool, and give feedback and comments.
- Sponsor tracks and prize pools are listed in the handover (outside the section this file draws from); not copied here.

## Hard rules
- **Version control:** large single commits or missing history may lead to disqualification.
- **AI tools:** allowed, but document where and how they were used. Projects relying entirely on AI may lose eligibility.
- **Spec-driven workflows:** include all spec files, prompts and planning artifacts in the repo.
- **Video bans:** no speeding up, no phone recording, no text-to-speech or AI voiceover. The email requires "audio without music"; the website bans music used in place of talking. Treat both as binding: no music.
- API-key, rate-limit and licensing constraints: TODO(Dhruv) (not stated in the source section).

## Judging
- Finalist session: 7 minutes = 4-minute demo + 3 minutes of questions.
- **Rubric.** The source lists five criteria and **publishes no weights**. Do not invent any.

| Criterion | Weight |
| --- | --- |
| Technicality | not published |
| Originality | not published |
| Practicality | not published |
| Usability (UI, UX, DX) | not published |
| WOW factor | not published |

- Prepare for: what inspired the project, which tools were used and why, and what challenges it solved.

## Team
| Person | Role listed on ETHGlobal |
| --- | --- |
| Dhruv Mulay (Main Agent) | Backend, frontend, fullstack, product, design, smart contracts, other |
| Akhilesh Nawale | Fullstack developer |
| Somnath Ghadge | Other |

## Known email/website conflicts (as checked Oct 31)
Demo video: email says required for finalists, website says "optional" (follow the email). Live deployment: email only. Public repo: the website says a GitHub repo or equivalent is required and does not say public; the email is stricter (follow it).
