# UI/UX components and patterns

## 1. Experience architecture

The application has three top-level states:

1. **Entry:** login card plus settings modal.
2. **Learning/assessment shell:** responsive sidebar, running score, timer, content area, optional console drawer, and question pager.
3. **Completion:** score summary with identity, earned/possible score, status copy, and QR result.

Within the shell, content switches among the ungraded Subnet Visualizer, Atoms 1–5, and optional generic conversion exercises. Practice and exam share most components but change the available tools, aids, reset behavior, and landing page.

## 2. Design tokens

The canonical values live in `:root` in `styles.css`.

### Color

| Token/role | Value | Meaning |
|---|---:|---|
| Background | `#0f172a` | App canvas |
| Surface | `#1e293b` | Cards, sidebar, panels |
| Surface hover | `#253247` | Raised/interactive surface |
| Border | `#32405a` | Separation and field outlines |
| Primary / locked | `#3b82f6` | Primary action and classful/network bits |
| Borrowed | `#f59e0b` | Borrowed subnet bits |
| Host / success | `#10b981` | Host bits and correct state |
| Network ID / error | `#ef4444` | Network boundary and incorrect state |
| Broadcast | `#eab308` | Broadcast boundary |
| Task accent | `#818cf8` | Neutral step/progress chrome |
| Main text | `#e2e8f0` | Primary content |
| Secondary text | `#94a3b8` | Supporting copy |
| Tertiary text | `#64748b` | De-emphasized metadata |

Semantic colors must remain stable across every view. A new feature should not use blue, amber, green, red, or yellow decoratively when that could be confused with bit meaning. Always pair color with a label, icon, pattern, or state text.

### Typography

- UI/body: Roboto, then system sans-serif fallback.
- Binary, IP addresses, masks, formulas, and console content: Roboto Mono, then monospace fallback.
- Use tabular or monospaced treatment when alignment carries meaning.
- Keep question prompts in readable prose; reserve uppercase eyebrow labels for scan structure.

### Shape, elevation, motion

- Borders and surface contrast carry most hierarchy in the dark theme.
- Shared shadows: small, medium, and large tokens.
- Default transition: 300 ms cubic-bezier easing.
- Motion includes entry/slide, modal, spinner, timer, and feedback effects.
- `prefers-reduced-motion` must remove nonessential animation; correctness and navigation may not depend on motion.

## 3. Layout and navigation

### Login shell

- Full-screen overlay containing a centered card.
- Product title, settings icon, email field, student-number field, primary Login action, and inline error live region.
- The settings icon is available before authentication because mode affects the generated session.

### Application shell

- Desktop: sidebar participates in the layout and can collapse manually.
- Mobile (≤768 px): sidebar becomes off-canvas with hamburger, close button, backdrop, and automatic close after selection.
- Main content owns the vertical scroll region; Atom pager bars remain outside that scrolling region.
- Sidebar order: identity/timestamp, total score and QR, tool/module navigation, optional exercise list, export action.

### Content hierarchy

- One page-level view at a time.
- Page header identifies the tool/module and may include status, hint, presenter, or display controls.
- A question card contains context, required action, interaction surface, verification, and feedback.
- Atom question pagination shows five nearby page slots on wide screens and a compact selector on mobile.

## 4. Shared component inventory

### Buttons

| Component | Use | Required states |
|---|---|---|
| Primary button | Login, save, verify, confirm | default, hover, focus-visible, active, disabled |
| Secondary button | Cancel, export, reset/alternate action | same as primary |
| Icon button | Settings, close, reset boundary | tooltip/accessible name, focus-visible, disabled |
| Segmented control | Global visualizer display mode | selected state exposed with `aria-pressed` or radio semantics |
| Pager button | Previous, next, question number | current, available, disabled, focus-visible |

Use native `<button>` elements. Icon-only buttons require an accessible name; disabled appearance must not rely only on opacity.

### Form controls

- Login text/email fields.
- Number input for timer and IP octets.
- Radio groups for activity and practice-seed mode.
- Toggle for automatic sample output.
- Select controls for per-panel display overrides and mobile question jump.
- Typed answer fields for Atom 5 and legacy conversion content.

Every field needs a persistent label, error association, focus state, and a disabled/locked state distinct from read-only instructional values.

### Cards and panels

- **Base card:** surface container used for login, questions, and modal content.
- **Requirement card:** Given → requirement/target → task sequence for an Atom question.
- **Visualizer panel:** numbered header, optional metadata/display selector, instructional hint, and derived content.
- **Formula box:** expandable explanation with formula, substituted values, and result.
- **Comparison card:** classful/classless statistics with expandable overflow.
- **Score circle:** prominent earned/possible summary; retain textual equivalent.

### Status and feedback

- Score badge: unanswered, partial, or complete.
- Timer badge: normal, warning at five minutes, critical at one minute.
- Feedback region: correct, partial, incorrect, or informational text announced through a live region.
- Warning banner: invalid or special address-class state in the visualizer.
- Loader/spinner: roster or content work; pair animation with status text.
- Toast: transient settings confirmation; should use a noninterruptive live region instead of inline styles in future cleanup.

### Dialogs

- Settings dialog.
- Alert dialog.
- Atom 5 hint dialog.
- Completion/score-summary dialog.

All dialogs should implement: labelled title, optional description, focus trap, initial focus, Escape where safe, overlay behavior, and focus restoration. The current markup supplies dialog roles/labels but needs complete focus management.

### Sidebar and progress

- Identity pill and live timestamp.
- Running total (`earned / possible`).
- Live QR result block.
- Tool/module navigation item with icon, label, optional “Ungraded” tag, and module score.
- Optional phase heading and one row per legacy exercise.

The active row, completion state, and partial state must each have a non-color cue.

### Console drawer

- Right-edge drawer tab appears only for exercises with sample output and only while the panel is closed.
- Sliding panel has console title, output, and close action.
- Auto-open defaults by device width and remains user-controllable.
- The drawer is exercise-specific and must close when navigating to visualizer/Atom pages without sample output.

## 5. Domain-specific components

### Bit cell

A bit cell represents 0/1 plus a semantic role: locked network, borrowed subnet, or host. Variants include editable, derived/read-only, unknown/cycling, correct, incorrect, and locked-after-grading.

Interaction contract:

- Native button semantics preferred.
- Space/Enter activates the same transition as pointer click.
- Accessible name includes position, current value, and role, for example “Octet 3, bit weight 32, borrowed bit, value 1.”
- State change is announced without rereading the entire grid.

### Octet visualization

An octet composes:

- decimal total;
- positional weights 128/64/32/16/8/4/2/1;
- eight bit cells;
- octet label and optional dot/CIDR suffix.

All panels and Atoms should use this same composition so students do not relearn the notation.

### CIDR curtain / 32-bit grid

- Four octet groups in one logical sequence.
- Locked, borrowed, and host regions remain visually continuous across octet boundaries.
- Clicking an eligible boundary changes borrowed-bit count rather than independently toggling arbitrary bits.
- Responsive layouts may wrap by octet but must preserve reading order and boundary meaning.

### Address row

Used for network, first host, last host, and broadcast. It combines an address-role label, subnet index when relevant, and either bit visualization or dotted-decimal display. Network and broadcast roles use both text and semantic color.

### Subnet permutation table

- Row index/subnet index.
- Borrowed-bit pattern.
- Derived network address.
- Active-row selection that drives host inspection.
- Controlled expansion when the subnet count is large.

### Atom interaction patterns

| Atom | Primary interaction | Feedback granularity |
|---|---|---|
| Atom 1 | Move/click subnet boundary to borrow exact bits | Whole card |
| Atom 2 | Toggle mask bits after locked classful prefix | Whole card |
| Atom 3 | Set boundary, mask, and first/last subnet patterns | Per answerable item |
| Atom 4 | Compose subnet IDs plus network/broadcast host bits | Per answerable item |
| Atom 5 | Type one scenario answer; optional method hint | Whole card |

## 6. Responsive behavior

The stylesheet currently uses important breakpoints at 900, 768, 720, 640, 480, and 400 px.

- Above 900 px: preserve full 32-bit rows where space allows.
- 900–641 px: wrap visual grids by octet while keeping groups aligned.
- 768 px and below: use off-canvas navigation and compact pager controls.
- 480 px and below: stack dense comparison/table content and enlarge touch targets.
- 400 px and below: favor one octet per row for the narrowest supported devices.

Use container behavior for nested components when possible; viewport-only rules can mis-size content inside the sidebar, dialog, or presenter layout.

## 7. Accessibility checklist

- One logical heading hierarchy per visible view.
- A skip link to main content and programmatic focus after navigation.
- Native controls first; custom roles only with complete keyboard/state behavior.
- Minimum 44×44 CSS-pixel touch target where controls are densely packed.
- Visible `:focus-visible` treatment on every interactive element.
- Correct/error/locked/bit-role states conveyed beyond color.
- Live announcements limited to meaningful changes; avoid announcing every timer second.
- Dialog focus trapped and restored.
- Tables use semantic headers when data is tabular.
- IP addresses and binary groups have screen-reader-friendly labels that avoid character-by-character noise unless requested.
- Content works at 200% zoom and 360 CSS pixels without loss of action or meaning.
- Reduced-motion preference removes confetti and nonessential transitions.

## 8. Content guidelines

- Use “subnet mask,” “CIDR prefix,” “network address,” “broadcast address,” and “usable hosts” consistently.
- State whether subnet numbering is zero-based when asking for “Subnet N.”
- Separate Given, Requirement, and Task instead of embedding all facts in one paragraph.
- Feedback should say what dimension is wrong without revealing an exam answer.
- Practice hints can explain the next method step, then link to the prerequisite Atom.
- Avoid using “authentication” for the current CSV match; call it roster validation or student entry.
- Explain that the application teaches classful subnetting as a learning scaffold.

## 9. Component change protocol

Before adding or changing a component:

1. Reuse an existing semantic token and shared state pattern where meaning matches.
2. Define keyboard, touch, focus, disabled, locked, correct, and incorrect behavior.
3. Test in both practice and exam modes.
4. Verify narrow mobile, desktop, and presenter contexts.
5. Check announcements and non-color cues.
6. Update this inventory if the component introduces a new durable pattern.
