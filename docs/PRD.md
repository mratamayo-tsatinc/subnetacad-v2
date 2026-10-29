# Product requirements document

## 1. Purpose

This PRD formalizes the current SubnetAcad v2 behavior and the requirements needed to make it dependable as a classroom learning and assessment tool. It uses **Implemented**, **Partial**, and **Planned** to separate repository facts from proposed work.

## 2. Product objective

Enable a student to learn and demonstrate classful IPv4 subnetting through reproducible, visually scaffolded questions while enabling an instructor to configure activity parameters without modifying the core front-end engine and to collect an interpretable score with minimal deployment overhead.

## 3. Core user journeys

### Journey A: practice

1. Student opens Settings from the login screen and selects Practice.
2. Student chooses a fixed or fresh question set and signs in with listed credentials.
3. The app opens the Subnet Visualizer.
4. Student explores the six linked panels or enters an Atom module.
5. Student verifies an answer, sees feedback, and may reset and retry.
6. Student checks the running total or downloads results.

### Journey B: timed exam

1. Student selects Exam and the configured duration, then signs in.
2. The app deterministically generates that student's questions and opens the first enabled scored module.
3. The visualizer is unavailable; bit-weight labels are reduced to avoid answer leakage.
4. Each verified response locks. The attempt and deadline persist locally.
5. Refreshing the page restores the same attempt and remaining time.
6. Completion or timeout locks the attempt and displays the score and QR result.

### Journey C: instructor configuration

1. Instructor or maintainer opens the dedicated configuration section in `script.js`.
2. The user changes parameters such as enabled modules/subtypes, question counts, ranges, allowed CIDRs/classes, mode, or timer defaults.
3. The core generators, graders, renderers, navigation, and persistence code remain unchanged.
4. The user validates the resulting question set and total score, then deploys the static files and roster resource.

## 4. Functional requirements

### Identity and entry

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| AUTH-01 | The student can enter with a matching email and student number. | Implemented | Exact values matching one CSV row open the app; any mismatch produces an inline error. |
| AUTH-02 | Failure to load the roster must produce an actionable user-facing state. | Planned | Login is disabled and explains that the roster could not be loaded; retry is available. |
| AUTH-03 | Production assessment identity must be validated without exposing student identifiers to clients. | Planned | No raw roster/ID file is publicly downloadable; the server returns only an authenticated session. |

### Mode and session configuration

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| MODE-01 | Settings can select Practice or Exam before entry. | Implemented | Mode-specific controls appear and the saved choice drives the landing page and grading behavior. |
| MODE-02 | Practice can use a stable shared seed or a new seed per login session. | Implemented | Fixed mode regenerates the same set; random mode remains stable within a session and changes on a later login. |
| MODE-03 | Exam duration accepts 1–999 minutes. | Implemented | Invalid values are rejected; valid values initialize the timer. |
| MODE-04 | Mode controls must not be changeable after an attempt begins without an explicit restart policy. | Partial | Settings are exposed only on the login screen, but no server policy prevents reload/manipulation. |

### Question generation and curriculum

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| GEN-01 | The same exam identity and configuration reproduce the same questions. | Implemented | Reload/resume recreates equal question values and order before saved state is applied. |
| GEN-02 | Different students receive independently seeded exam sets. | Implemented | Two different email seeds normally produce different values while preserving configured skill coverage. |
| GEN-03 | Every module and subtype can be enabled, counted, and difficulty-constrained. | Implemented | Disabled/zero-count content generates no cards; allowed A/B/C classes are respected. |
| GEN-03A | Curriculum parameters must remain separate from the core application logic. | Implemented | A user can alter enabled content, counts, ranges, CIDR pools, allowed classes, and answer strictness in the configuration section without editing generators, graders, or renderers. |
| GEN-04 | Random generation must never produce invalid, impossible, or duplicate-heavy assessments. | Partial | Bounds exist, but no automated property-based coverage or duplicate threshold is present. |
| CURR-01 | The system supports configurable Atoms 1–6 and optional conversion phases 1–7. | Implemented | Enabled content appears, is graded, contributes to totals, and participates in persistence; the current profile exposes Atom 6 only. |
| CURR-01A | Atom 6 provides incrementally arranged VLSM planning practice. | Implemented | Foundation scenarios use two routers, intermediate scenarios use three, and advanced scenarios use four; every router has at most two LANs and all router links are ordered last as an equivalent group. |
| CURR-02 | The curriculum copy must state that classful addressing is a teaching abstraction. | Planned | An orientation/about surface includes this context without distracting from the activity. |

### Practice and learning support

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| LEARN-01 | Practice opens an ungraded, interactive subnet visualizer. | Implemented | Editing address, borrowed bits, view mode, active subnet, or formulas updates all dependent panels. |
| LEARN-02 | Practice answers can be checked, explained, and reset. | Implemented | Feedback identifies correctness; reset returns the card to an unlocked initial state. |
| LEARN-03 | Applied scenarios offer hints that teach the method without revealing the current answer. | Implemented | Hint content uses general formulas and separate example values and can route to related practice. |
| LEARN-04 | The interface offers sample output only when an exercise supplies it. | Implemented | Drawer/tab visibility follows sample availability and the user's auto-show preference. |

### Assessment, scoring, and timing

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| EXAM-01 | Exam mode hides the answer-producing visualizer and relevant bit-weight aids. | Implemented | The visualizer cannot be opened through navigation or direct function call in exam mode. |
| EXAM-02 | A verified exam response cannot be edited or reset. | Implemented | Inputs lock, the action becomes disabled, and reload preserves the lock. |
| EXAM-03 | The timer is based on a fixed deadline and survives refresh without granting extra time. | Implemented | Remaining time is recomputed from the saved timestamp; an expired attempt reopens locked. |
| EXAM-04 | Timeout locks every scored item and shows the final score. | Implemented | At zero, inputs disable, state persists, and a warning summary opens. |
| SCORE-01 | Totals are derived from each exercise's answer slots, not hard-coded labels. | Implemented | Module and overall denominators reflect generated question structures. |
| SCORE-02 | Completing every card ends the exam regardless of whether answers are correct. | Not met | A card is complete when it is locked/answered; a score of zero must not keep the exam running. Current `checkIfAllAnswered()` violates this criterion. |
| SCORE-03 | Scoring rules are explicit per interaction. | Implemented | Atom 1/2/5 cards are all-or-nothing; Atom 3/4 and octet conversions can award per-item credit. |

### Persistence and results

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| DATA-01 | Exam progress persists per student in the same browser. | Implemented | Locks, score, answers/order, completion, duration, and deadline restore from `localStorage`. |
| DATA-02 | Practice work is ephemeral. | Implemented | Practice does not write exam session records. |
| DATA-03 | Students can export a per-exercise CSV. | Implemented | Download includes student, display label, and earned/possible score for each generated exercise. |
| DATA-04 | A QR result can be generated from the current or final total. | Implemented with security limitation | QR opens the configured result page and carries email, timestamp, and score in an encrypted client-generated token. |
| DATA-05 | High-stakes results must be verifiable and tamper-evident. | Planned | Result tokens are signed by a trusted server and the verifier checks attempt identity, score, and issuance. |
| DATA-06 | Student PII must follow an explicit retention and access policy. | Planned | Data inventory, owner, retention period, deletion flow, and access controls are documented and enforced. |

### Navigation and device support

| ID | Requirement | Status | Acceptance criteria |
|---|---|---|---|
| UX-01 | Desktop uses a collapsible in-layout sidebar; mobile uses an off-canvas sidebar. | Implemented | At 768 px and below, backdrop and focusable close controls appear without blocking main content after selection. |
| UX-02 | Question pagination keeps large modules manageable. | Implemented | Desktop shows a five-item window; mobile provides a compact question selector and previous/next navigation. |
| UX-03 | Touch users have non-drag alternatives where ordering exists. | Implemented | Up/down controls appear when touch/coarse pointer is detected. |
| UX-04 | All essential interactions are keyboard operable with visible focus. | Partial | Many controls and Escape paths exist, but bit cells use custom interactive markup and require a full keyboard/focus audit. |

## 5. Non-functional requirements

| ID | Requirement | Target | Current assessment |
|---|---|---|---|
| NFR-01 | Initial usable load | ≤ 3 seconds on a typical school connection | Not measured; large unbundled JS/CSS and CDN dependencies are risks. |
| NFR-02 | Answer feedback latency | ≤ 100 ms for local grading | Likely met; calculations are local, but no benchmark exists. |
| NFR-03 | Browser support | Current Chrome, Edge, Firefox, Safari | Modern APIs are used; no compatibility matrix/test run exists. |
| NFR-04 | Responsive support | 360 px phone through classroom projector | Extensive breakpoints exist at 400/480/640/720/768/900 px; visual regression testing is absent. |
| NFR-05 | Accessibility | WCAG 2.2 AA for core journeys | Partial; semantics and reduced motion are present, but contrast, focus order, dialogs, custom toggles, and bit controls need audit. |
| NFR-06 | Reliability | 99.5% successful session start during scheduled use | Static hosting is simple, but CSV/CDN failures have no resilient UX. |
| NFR-07 | Security | No client-exposed credentials or forgeable official results | Not met for high-stakes use by architectural design. |
| NFR-08 | Maintainability | Domain modules with automated generation/grading tests | Not met; application logic and CSS are monolithic. |

## 6. Configuration contract

The front-end configuration layer is the supported activity-authoring interface. It controls:

- Phase 1–7 enablement, question counts, bit widths, decimal ranges, and CIDR lists.
- Atom 1–4 enablement, question counts, and allowed address classes.
- Atom 5 master enablement plus per-subtype enablement, counts, and allowed classes.
- Strict leading-zero validation for binary answers.
- Default mode, timer duration, automatic sample output, and fixed/random practice seeding.

Requirements for configuration changes:

1. A valid parameter change must not require a corresponding edit to core logic.
2. Disabled or zero-count activities must cleanly disappear without leaving broken navigation or score denominators.
3. Generated questions must respect configured bounds and allowed classes.
4. Totals must be calculated from generated content rather than duplicated configuration values in the UI.
5. The deployed configuration should be versioned or fingerprinted so an assessment can be reproduced.

## 7. Data model

### Runtime exercise

Every generated entry in `exerciseData` uses a shared core shape:

- identity and presentation: name/key, label, short label, phase, type, prompt;
- grading: correct value(s), answer slots, score, partial flag, locked flag;
- response: serialized `userAnswer` or `userOrder`;
- type-specific subnet fields: octets, class, network bits, borrowed bits, host bits, CIDR, subtype, or card copy.

The length of `answers` is the source of truth for the score denominator.

### Persisted exam session

- configured timer minutes;
- fixed exam deadline timestamp;
- completion flag and save timestamp;
- per-exercise locked, score, partial state, ordering, and response.

The storage key includes the student's email. This is convenient but exposes PII and is not suitable as a trusted record.

## 8. Analytics events for a future release

Collect only after privacy review and without recording answer content unnecessarily:

- session started: mode, curriculum version, device class;
- question shown/checked/reset: module, subtype, attempt count, correctness band, duration;
- hint opened and related-practice route used;
- session resumed, timed out, or completed;
- export/QR generated;
- client error and roster/dependency load failure.

## 9. Release acceptance

A classroom release is ready when:

1. The generated-answer and grading suites pass for every enabled type and address class.
2. A wrong answer on every card still allows the exam to finish normally.
3. Refresh/resume and timeout pass with a controlled clock.
4. Login failure, missing roster, and unavailable CDN behavior are understandable.
5. Core journeys pass keyboard-only and 360 px viewport checks.
6. The deployment owner explicitly classifies the release as low-stakes client-authoritative or enables trusted server validation.
