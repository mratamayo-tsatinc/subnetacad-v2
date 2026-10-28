# Project brief

## Product summary

SubnetAcad v2 is a pure front-end, self-contained web application for teaching and assessing classful IPv4 subnetting. It turns subnetting from an abstract arithmetic exercise into a spatial bit model: network bits, borrowed subnet bits, and host bits share a consistent visual language across the exploratory visualizer and five progressively applied learning modules.

The current release is configured as a midterm assessment while retaining a practice mode for instruction and review. Curriculum and session behavior are parameterized in a dedicated configuration section in `script.js`; users can change those values without touching the core application engines.

## Problem

Students commonly memorize subnetting formulas without understanding how a prefix boundary changes the subnet mask, subnet count, address ranges, network address, and broadcast address. Instructors also need a lightweight way to deliver varied problems, enforce a time limit, score work consistently, and collect a portable result without provisioning a full learning-management backend.

SubnetAcad addresses this with deterministic question generation, direct manipulation of bit boundaries, immediate visual feedback in practice, exam locking, and a shareable score artifact.

## Users and needs

### Primary: networking student

- See how decimal octets, binary weights, CIDR, masks, subnets, and hosts relate.
- Practice the same skill repeatedly with predictable or fresh question sets.
- Work on desktop or mobile with controls appropriate to pointer or touch input.
- Understand correctness through per-item feedback and consistent semantic colors.
- Resume a timed attempt after an accidental refresh on the same browser.

### Primary: networking instructor

- Control which skills, question counts, address classes, and difficulty bands appear.
- Give each student a reproducible but different exam set.
- Prevent resets and access to the answer-producing visualizer during an exam.
- Obtain a score through downloaded CSV or a QR-linked result.
- Run the activity from static hosting with minimal operational overhead.

### Secondary: maintainer

- Change curriculum and session parameters through the configuration section without modifying core logic.
- Reuse one visual grammar across lessons and assessment.
- Deploy without a build pipeline.

## Configuration-first architecture

The product intentionally separates **what an activity contains** from **how the application works**:

- Configuration defines enabled modules, question counts, input ranges, CIDR pools, allowed classes, answer-format strictness, default mode, timing, practice seeding, and sample-output preference.
- Core code supplies reusable seeded generators, subnet calculations, renderers, graders, navigation, persistence, feedback, exports, and QR generation.
- The same core code can therefore support a practice set, quiz, midterm, or differently scoped subnetting activity by changing parameters rather than rewriting behavior.

Configuration changes should be treated as content/assessment authoring. Core-code changes are only required when introducing a new question type, grading rule, interaction pattern, or platform capability.

## Learning model

The implemented Atom sequence is a scaffold from constraints to application:

1. **Atom 1 — The Constraint:** determine how many bits to borrow from a subnet or usable-host requirement.
2. **Atom 2 — The Mask Assembly:** construct the subnet mask for a host address and CIDR.
3. **Atom 3 — The Space Map:** build subnet IDs for the first and last subnet ranges.
4. **Atom 4 — The Boundaries:** derive network and broadcast boundaries.
5. **Atom 5 — Applied Scenarios:** answer narrative problems spanning subnet counts, hosts, borrowed bits, masks, addresses, and subnet membership.

The practice-only Subnet Visualizer supports discovery through six linked panels: address/class detection, CIDR bit boundary, mask comparison, subnet permutations, host-range inspection, and classful/classless comparison.

## Current product scope

### Implemented

- Client-side student allowlist check using school email and student number.
- Pre-login Practice and Exam mode selection.
- Fixed or session-random practice question sets.
- Email-seeded, reproducible per-student exam questions.
- Configurable question counts and allowed address classes.
- Configuration-driven curriculum and session defaults that can be manually edited without changing core logic.
- Five scored Atom modules with question pagination.
- Optional legacy conversion phases for decimal, binary, IP, mask, and classful CIDR work; disabled in the checked-in configuration.
- 90-minute default exam timer with warning and critical states.
- Exam answer locking, disabled reset, hidden visualizer, and `localStorage` resume.
- Running score, per-module score badges, completion summary, confetti, CSV export, and QR result sharing.
- Responsive sidebar, touch-specific ordering controls, keyboard Escape handling, ARIA labels/live regions, and reduced-motion handling.
- Dark, bit-semantic visual system and optional presenter mode.

### Out of scope for the current static release

- Server-verified identity or secure authentication.
- Server-authoritative timers, scores, attempts, or result signatures.
- Instructor dashboard, roster management, gradebook sync, or analytics.
- Multi-device attempt resume.
- Offline-first installation/service worker.
- IPv6, VLSM route planning, supernetting, or route aggregation exercises.
- Localization.

## Current configuration baseline

| Area | Checked-in setting |
|---|---|
| Default mode | Exam |
| Exam duration | 90 minutes |
| Practice seed | Fixed by default; random is selectable |
| Legacy phases 1–7 | Disabled |
| Atom 1 | 10 questions; Classes A/B/C |
| Atom 2 | 10 questions; Classes A/B/C |
| Atom 3 | 2 questions; Classes B/C |
| Atom 4 | 1 question; Class C |
| Atom 5 | 50 questions across 10 enabled subtypes |
| Strict binary width | Enabled |

Atom 3 and Atom 4 award multiple points within a question, so the total possible score is data-driven rather than equal to the number of question cards.

## Product principles

- **Show the bits behind the answer.** Prefer spatial, inspectable transformations over opaque calculators.
- **Keep semantic color stable.** Blue is locked/network, amber is borrowed/subnet, green is host, red is network ID, and yellow is broadcast.
- **Separate learning from assessment.** Practice can expose formulas, hints, retries, and the visualizer; exam mode restricts answer-revealing affordances.
- **Make generated work reproducible.** A seed must regenerate the same questions and ordering when an attempt resumes.
- **Progressive complexity.** Teach one decision at a time before asking students to combine decisions in scenarios.
- **Device-appropriate interaction.** Do not rely on drag-and-drop alone where touch or keyboard users need an alternative.

## Constraints and assumptions

- The application is served over HTTP(S); `students.csv` is fetched at load time.
- Google Fonts, Font Awesome, and QRCode.js currently load from third-party CDNs.
- Modern browser support is required for Web Crypto, `localStorage`, template literals, and current DOM APIs.
- Classful A/B/C subnetting is a teaching model; it is not presented as modern Internet routing architecture.
- Static hosting is operationally convenient but cannot make the exam tamper-resistant.
- Configuration values are intentionally editable in source; deployments should record the exact configuration used for each activity.

## Success measures

The current repository does not collect analytics. Recommended measures for a future instrumented release are:

- At least 95% of enrolled students can enter and begin without instructor intervention.
- At least 99% of answer checks produce the expected result in a generated-answer test suite.
- Refresh recovery restores the same questions, answers, locks, score, and real deadline in all supported browsers.
- At least 90% of students can complete key flows at 360 px width without horizontal page scrolling.
- Keyboard-only users can reach, operate, and understand every scored control.
- Student score discrepancies attributable to generation or grading defects remain at zero.

## Key risks

| Risk | Impact | Current condition | Direction |
|---|---|---|---|
| Client-side roster and student IDs | Personal data exposure and impersonation | `students.csv` is downloaded by every browser | Move identity validation server-side; never publish raw IDs |
| Client-authoritative exams | Attempts, timers, and scores can be altered | All logic and state are in JavaScript/`localStorage` | Treat as low-stakes or add a trusted assessment service |
| Shared QR passphrase in source | Results can be fabricated by a knowledgeable user | Code correctly notes it is obfuscation, not a security boundary | Use server-signed result tokens |
| Local-only persistence | Attempt cannot follow the student across devices; clearing storage loses it | Exam state is keyed by email in one browser | Store attempt state server-side if continuity is required |
| CDN dependencies | Fonts/icons/QR may fail on restricted networks | Three remote resources are loaded at runtime | Self-host or provide resilient fallbacks |
| Monolithic source files | Regression risk and slow maintenance | Most logic lives in one ~8.4k-line script and one large stylesheet | Modularize by domain with automated tests |
| Incorrect-zero completion path | A fully answered exam with any zero-scored card may not end early | Completion requires both `locked` and nonzero `score` | Define completion as answered/locked, independent of correctness |
