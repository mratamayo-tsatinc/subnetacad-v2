# Implementation plan

## 1. Current architecture

SubnetAcad is a pure front-end, static single-page application with direct DOM manipulation. It has a configuration-first design: activity authors modify parameter objects in `script.js`, while the reusable core consumes those values to generate, render, grade, and persist an activity.

```text
index.html
  ├─ login/settings/modals
  ├─ sidebar + score summary
  ├─ generic exercise host
  ├─ six-panel visualizer
  └─ five Atom view hosts + pagination

styles.css
  ├─ shared tokens/layout/components
  ├─ responsive and interaction states
  ├─ visualizer-specific styling
  └─ Atom-specific styling

script.js
  ├─ editable curriculum/session configuration
  ├─ configuration-driven seeded generators
  ├─ renderers + interaction handlers
  ├─ graders + feedback + scoring
  ├─ navigation + pagination + dialogs
  ├─ exam timer + local persistence
  ├─ CSV + QR result output
  └─ SubnetVisualizer IIFE/calculation engine

students.csv ──fetch──> client-side allowlist check
localStorage <────────> per-email exam session
Web Crypto + QRCode.js ──> external result page URL
```

There is no package manifest, test runner, build system, application API, or database. Deployment can copy the four runtime files to static hosting.

### Configuration boundary

The supported customization boundary is the configuration block, not the core engine. Routine activity changes should be limited to:

- enable/disable flags;
- question and subtype counts;
- bit widths, numeric ranges, and CIDR pools;
- allowed address classes;
- answer-format strictness;
- default mode, timer, practice seed mode, and sample-output behavior.

Generators, subnet arithmetic, grading, rendering, navigation, persistence, and exports should remain unchanged for parameter-only customization. New core logic is warranted only for a genuinely new capability or question/interaction type.

## 2. Immediate stabilization backlog

These items reduce classroom risk without changing the product model.

### P0 — correctness and recoverability

1. **Fix completion semantics.** Change completion to require every generated exercise to be locked/answered, not to have a nonzero score. Add tests for all-correct, partially correct, and all-wrong submissions.
2. **Add a deterministic test harness.** Extract or expose pure subnet helpers, generators, and graders. Test boundary prefixes, class edges, minimum host bits, first/last subnet calculations, and all Atom 5 subtypes.
3. **Validate the author-facing configuration at startup.** Detect invalid counts, CIDR lists, subtype keys, allowed classes, impossible ranges, and empty assessments. Fail with an instructor-readable diagnostic while preserving configuration as the only routine customization surface.
4. **Handle roster-load failure.** Track fetch/parse state, reject malformed rows, disable login until ready, and show retry/support guidance.
5. **Version persisted sessions.** Store a curriculum/config fingerprint. Do not apply stale responses to a changed question model; offer a deliberate restart/migration policy.

### P1 — usability and accessibility

1. Trap focus in modals, restore focus on close, and connect descriptions via `aria-describedby`.
2. Make every bit cell a native button where practical; otherwise implement Space/Enter, roving focus, role, state, and clear accessible names.
3. Add a skip link and reliable main-content focus when views/questions change.
4. Audit semantic color contrast and ensure correctness/state never relies on color alone.
5. Persist the sample-output preference intentionally or label it session-only.
6. Add a visible loading/error state while the student roster is fetched.

### P1 — privacy and integrity decision

Choose and document one deployment profile:

- **Learning/low-stakes profile:** retain static architecture, remove language implying secure authentication, minimize roster data, and clearly label results as student-generated.
- **Assessment profile:** introduce authenticated server sessions, server-held roster, server-authoritative deadline and attempt state, and signed result records.

Do not attempt to solve high-stakes integrity by obfuscating JavaScript or rotating a client-embedded secret.

## 3. Modularization target

Move incrementally; preserve the no-build deployment until tests protect behavior.

```text
src/
  config/
    curriculum.js
  domain/
    binary.js
    ipv4.js
    subnet.js
    random.js
  questions/
    phases.js
    atom1.js ... atom5.js
  grading/
    graders.js
    feedback.js
  state/
    session.js
    persistence.js
  ui/
    navigation.js
    dialogs.js
    pagination.js
    exercise-renderers/
    visualizer/
  integrations/
    roster.js
    csv-export.js
    results.js
```

Recommended sequence:

1. Extract pure arithmetic and seeded-random helpers with no DOM dependencies.
2. Extract generation and grading behind stable input/output contracts.
3. Introduce one application state object and explicit actions for answer, verify, reset, navigate, tick, resume, and finish.
4. Split renderers by view while retaining existing DOM IDs during migration.
5. Split CSS into tokens, foundations, shared components, views, and responsive overrides.
6. Optionally add a bundler only after source modules and deployment requirements justify it.

## 4. Delivery phases

### Phase 0 — baseline and safety net (1–2 days)

- Record the current config fingerprint and representative seeded fixtures.
- Treat the checked-in configuration as a versioned activity definition separate from the core engine.
- Add syntax checks, HTML validation, and a headless smoke test for login-to-first-question.
- Snapshot total question counts/score denominators for known seeds.
- Document supported browsers and static-host instructions.

**Exit gate:** current behavior is reproducible and automated checks can detect a broken start, generator, or total.

### Phase 1 — correctness and session fixes (2–4 days)

- Fix SCORE-02 completion behavior.
- Add generator/grader unit and property tests.
- Add configuration validation and roster error handling.
- Add persistence schema version/config fingerprint.
- Revoke or migrate stale exam records deliberately after curriculum changes.

**Exit gate:** all enabled types pass deterministic boundary tests; refresh and timeout pass with a fake clock.

### Phase 2 — accessible component foundation (3–6 days)

- Normalize buttons, fields, badges, feedback, dialogs, and pagers.
- Repair keyboard behavior for bit grids and custom controls.
- Implement modal focus management and view-change focus.
- Run automated accessibility checks plus manual keyboard/screen-reader smoke tests.
- Verify 360, 480, 768, 1024, and projector-width layouts.

**Exit gate:** all core journeys are keyboard-complete, state is not color-only, and no viewport causes page-level overflow.

### Phase 3 — maintainable modules (5–10 days)

- Execute the modularization sequence from section 3.
- Replace inline `onclick` attributes with event registration during view migration.
- Create a documented runtime state schema and renderer contracts.
- Add continuous integration for tests, linting, and smoke checks.

**Exit gate:** no production file is a cross-domain monolith; arithmetic, generation, grading, persistence, and UI can be tested independently.

### Phase 4 — integrity architecture (scope depends on profile)

For the assessment profile:

- Add server-side identity integration.
- Create attempt and response APIs with curriculum versioning.
- Make the deadline server-authoritative.
- Generate signed result URLs/QR tokens server-side.
- Add an instructor results view and auditable export.
- Define PII retention, authorization, and incident processes.

**Exit gate:** a client cannot authoritatively create, extend, or modify an official attempt or score.

## 5. Test strategy

### Unit and property tests

- Decimal/binary conversion for 0, 1, 127, 128, 255 and width validation.
- CIDR/mask conversion for /0 through /32, with curriculum-specific limits separately tested.
- Class detection at 1, 126, 127, 128, 191, 192, 223, 224, and 255.
- Borrowed-bit/host-bit formulas, including the two-address network/broadcast rule.
- Network, broadcast, host range, subnet index, and first/last subnet enumerations.
- Seed reproducibility and isolation among phases/Atoms.
- Allowed-class filtering and fallback behavior.
- Every Atom grader with empty, malformed, correct, partial, and wrong responses.

### Integration tests

- Roster load → valid/invalid login.
- Practice fixed/random seed behavior.
- Exam start → answer → lock → refresh → restore.
- Timer warning/critical/timeout with a controlled clock.
- All cards answered with zero score → normal completion.
- CSV content escaping and data-driven denominators.
- QR generation failure when Web Crypto, QRCode.js, or the network is unavailable.

### Visual and accessibility tests

- Login, settings, each Atom interaction, score summary, and all visualizer panels.
- Desktop/sidebar-open, desktop/sidebar-collapsed, tablet, and narrow mobile.
- Normal, hover, focus, active, correct, incorrect, partial, locked, disabled, loading, and error states.
- Reduced motion, 200% zoom, keyboard-only, and representative screen reader.

## 6. Operational checklist

Before each classroom deployment:

1. Confirm mode, duration, enabled modules, counts, subtypes, and allowed classes.
2. Generate at least 100 representative seeds and run invariant tests.
3. Confirm the displayed maximum score for several seeds.
4. Validate roster encoding and duplicates without exposing roster contents in logs.
5. Test from the actual hosting origin and school network.
6. Verify CDN availability or deploy local assets.
7. Test refresh, timeout, CSV, and QR destination on a clean browser profile.
8. Record the commit/config fingerprint and define how stale local sessions are handled.
9. Publish a support path and fallback assessment procedure.

## 7. Definition of done for future changes

- Requirement and acceptance criteria are identified.
- Generator and grader changes include deterministic tests.
- Score denominators and persistence compatibility are reviewed.
- Practice and exam behavior are both verified.
- Keyboard, mobile, and reduced-motion behavior are checked for UI changes.
- No PII, secret, or official result authority is newly placed in client code.
- Documentation is updated when configuration, scoring, architecture, or components change.
- Parameter-only activity changes remain confined to the documented configuration section.
