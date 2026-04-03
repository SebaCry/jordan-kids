# JordanList v2 — Design System

**Version:** 2.0  
**Last updated:** 2026-04-03  
**Scope:** Full-stack web application (React + Tailwind CSS 4)  
**Audience:** Frontend developers, designers, and QA engineers building JordanList v2.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Specifications](#5-component-specifications)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [Animation Guidelines](#7-animation-guidelines)
8. [Accessibility Requirements](#8-accessibility-requirements)
9. [Error & Empty States](#9-error--empty-states)

---

## 1. Design Principles

These four principles govern every design and implementation decision in JordanList v2. When in doubt, return to them.

### 1.1 Child-First

The system must be fully usable by a 6-year-old who is still learning to read. This is the highest-priority constraint.

- Prioritize icons over text labels. Text is a supplement, not the primary signal.
- Use large, clearly distinct touch targets. Never expect precision tapping.
- Avoid dense layouts. One primary action per screen for child-facing views.
- Never use technical language in the UI. "Error 404" becomes "No encontramos esa pagina".
- Test every child-facing screen with actual children from the congregation before shipping.

**Implication for developers:** When building a component, ask "Could a first-grader figure this out without help?" If the answer is no, simplify.

### 1.2 Joyful

Every interaction should produce a small moment of delight. This is a gamified system for children — flat, sterile UI is a failure mode.

- Correct answers, earned badges, added points, and completed readings must each trigger a distinct celebratory response (visual + described audio).
- Micro-animations on button press, card hover, and state changes are required, not optional.
- Copy must be warm and encouraging at all times. Errors say "Casi!" not "Incorrecto".
- Empty states must be friendly invitations, not cold placeholders.

**Implication for developers:** Animation and feedback are functional requirements, not cosmetic enhancements. Budget time for them.

### 1.3 Accessible

WCAG 2.1 Level AA is the minimum standard. This is non-negotiable.

- Every interactive element must have a visible focus ring.
- Color is never the sole differentiator. Always pair color with icon, shape, or text.
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text (18px+ bold or 24px+ regular).
- All non-decorative images must carry descriptive alt text.
- The full trivia game must be completable via keyboard alone.
- The `prefers-reduced-motion` media query must disable all non-essential animations.
- Touch targets are 48x48px minimum with 8px clearance between adjacent targets.

**Implication for developers:** Accessibility annotations are included in each component spec below. They are implementation requirements, not suggestions.

### 1.4 Progressive Disclosure

Complexity scales with role. A child sees only what a child needs. An admin sees everything, but not all at once.

- Child: single-purpose screens, large visuals, one decision at a time.
- Parent: read-only summaries, no management controls visible.
- Leader: management tools visible, but system configuration hidden.
- Admin: full system access, with advanced options in secondary panels or modals.

**Implication for developers:** Role-based rendering is a core pattern. Never render a control and then disable it based on role — hide it entirely for roles that cannot use it.

---

## 2. Color System

All color values are defined as CSS custom properties and Tailwind CSS 4 theme tokens. The palette is designed to be vibrant for children while maintaining WCAG AA contrast on all background colors used in this system.

### 2.1 Brand Colors

| Token               | Hex Value  | Tailwind Token          | Role & Rationale                                          |
|---------------------|------------|--------------------------|-----------------------------------------------------------|
| `--color-primary`   | `#3B82F6`  | `blue-500`               | Trust, calm. Used for primary CTAs, links, focus rings.   |
| `--color-secondary` | `#8B5CF6`  | `violet-500`             | Fun, creativity. Used for secondary actions, badges.      |
| `--color-accent`    | `#F97316`  | `orange-500`             | Energy, urgency. Used for timers, streaks, alert accents. |
| `--color-success`   | `#22C55E`  | `green-500`              | Correct, achievement. Correct answers, completion states. |
| `--color-warning`   | `#EAB308`  | `yellow-500`             | Attention. Partial progress, warnings, medium difficulty. |
| `--color-error`     | `#EF4444`  | `red-500`                | Wrong, careful. Incorrect answers, destructive actions.   |
| `--color-bg`        | `#FFF8F0`  | Custom: `warm-cream`     | App background. Warm cream avoids clinical white.         |
| `--color-surface`   | `#FFFFFF`  | `white`                  | Cards, modals, dialogs. Pure white for contrast.          |
| `--color-text`      | `#1E293B`  | `slate-800`              | Primary text. Dark charcoal, not full black.              |
| `--color-muted`     | `#64748B`  | `slate-500`              | Secondary text, placeholders, disabled labels.            |

### 2.2 Answer Button Colors (Trivia Game)

These are reserved specifically for the four answer buttons. They must not be reused for other purposes to avoid confusion during gameplay.

| Button | Hex Value  | Tailwind Token  | Usage                    |
|--------|------------|-----------------|--------------------------|
| A      | `#3B82F6`  | `blue-500`      | First answer option      |
| B      | `#22C55E`  | `green-500`     | Second answer option     |
| C      | `#F97316`  | `orange-500`    | Third answer option      |
| D      | `#8B5CF6`  | `violet-500`    | Fourth answer option     |

### 2.3 Badge Tier Colors

| Tier     | Hex Value  | Visual Treatment                                                         |
|----------|------------|--------------------------------------------------------------------------|
| Bronze   | `#CD7F32`  | Solid fill, no special effect.                                           |
| Silver   | `#C0C0C0`  | Solid fill, subtle inner shadow to simulate metallic depth.              |
| Gold     | `#FFD700`  | Solid fill + soft outer glow (`box-shadow: 0 0 12px rgba(255,215,0,0.6)`). |
| Platinum | `#E5E4E2`  | Solid fill + CSS `background: linear-gradient` shimmer animation cycling every 3s. |

### 2.4 Semantic Color Application Rules

- **Primary actions** (e.g., "Jugar", "Guardar", "Confirmar"): `--color-primary` background, white text.
- **Destructive actions** (e.g., "Eliminar", "Borrar"): `--color-error` background or outline, white or error-colored text.
- **Success states**: `--color-success` background at 10% opacity for background, full color for icons and borders.
- **Disabled states**: `--color-muted` text, `#E2E8F0` (slate-200) background. Never use the primary color at reduced opacity for disabled — it reads as a loading state.
- **Focus rings**: 3px solid `--color-primary`, 2px offset. Applied to all focusable elements via `:focus-visible`.

### 2.5 Dark Mode

Dark mode is not in scope for v2. The warm cream background is intentional for the church projection environment (bright rooms). Revisit in v3.

### 2.6 Tailwind CSS 4 Configuration

Define custom tokens in `tailwind.config.js` under `theme.extend`:

```js
// tailwind.config.js (relevant excerpt)
colors: {
  brand: {
    primary:   '#3B82F6',
    secondary: '#8B5CF6',
    accent:    '#F97316',
    success:   '#22C55E',
    warning:   '#EAB308',
    error:     '#EF4444',
  },
  bg: {
    warm: '#FFF8F0',
  },
  badge: {
    bronze:   '#CD7F32',
    silver:   '#C0C0C0',
    gold:     '#FFD700',
    platinum: '#E5E4E2',
  },
  answer: {
    a: '#3B82F6',
    b: '#22C55E',
    c: '#F97316',
    d: '#8B5CF6',
  },
}
```

---

## 3. Typography

### 3.1 Typeface

**Inter** is the sole typeface for all UI text. It is clean, highly legible at small sizes, and renders well on low-resolution projectors (relevant for leaderboard mode).

Load via Google Fonts or bundle locally:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Font weights in use: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold).

### 3.2 Type Scale

The scale uses an 8px baseline. All sizes are expressed in `rem` with a 16px root (default browser behavior must not be overridden).

| Token         | Size (px) | Size (rem) | Weight      | Line Height | Usage                                          |
|---------------|-----------|------------|-------------|-------------|------------------------------------------------|
| `display`     | 48px      | 3rem       | 800         | 1.1         | Leaderboard names, results screen score        |
| `h1`          | 36px      | 2.25rem    | 700         | 1.2         | Page titles, dashboard welcome headers         |
| `h2`          | 30px      | 1.875rem   | 700         | 1.25        | Section headings, card titles                  |
| `h3`          | 24px      | 1.5rem     | 600         | 1.3         | Trivia question text, sub-section headings     |
| `h4`          | 20px      | 1.25rem    | 600         | 1.4         | Card subtitles, stat labels                    |
| `body-lg`     | 18px      | 1.125rem   | 400         | 1.7         | Default body text in child-facing views        |
| `body`        | 16px      | 1rem       | 400         | 1.6         | Default body text in leader/admin views        |
| `body-sm`     | 14px      | 0.875rem   | 400         | 1.5         | Helper text, timestamps, secondary labels      |
| `caption`     | 12px      | 0.75rem    | 500         | 1.4         | Legal-style notes only. Never in child views.  |

**Hard rule:** 14px is the absolute minimum font size across the entire application. 12px (`caption`) is only permitted for non-essential metadata in adult-facing views. Never use 12px in child-facing views.

### 3.3 Role-Based Base Size

Child-facing views (`/play`, `/badges`, `/child-dashboard`) use `body-lg` (18px) as the base body size. All other roles use `body` (16px). This is achieved by adding a `data-role="child"` attribute on the layout root element and using a CSS selector:

```css
[data-role="child"] {
  font-size: 1.125rem; /* 18px */
  line-height: 1.7;
}
```

### 3.4 Reading View Typography

The reading view requires additional comfort settings due to longer reading sessions:

- Font size: `body-lg` (18px)
- Line height: 1.8 (above standard to reduce eye fatigue)
- Max content width: 680px (optimal reading column width)
- Letter spacing: 0.01em (slight openness without visible tracking)
- Paragraph spacing: 1.5em between paragraphs

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (8px Grid)

All spacing values are multiples of 8px. Half-unit (4px) is permitted only for tight internal component spacing.

| Token  | Value | Usage                                          |
|--------|-------|------------------------------------------------|
| `sp-1` | 4px   | Tight internal padding (icon + label gaps)     |
| `sp-2` | 8px   | Default small gap (between list items)         |
| `sp-3` | 12px  | Compact card internal padding                  |
| `sp-4` | 16px  | Standard card padding, form field gap          |
| `sp-5` | 20px  | Medium section spacing                         |
| `sp-6` | 24px  | Card padding (large), section internal margin  |
| `sp-8` | 32px  | Between major sections on a page               |
| `sp-10`| 40px  | Page-level vertical rhythm                     |
| `sp-12`| 48px  | Minimum touch target size (height and width)   |
| `sp-16`| 64px  | Large visual separations, hero section padding |

Use Tailwind's `p-`, `m-`, `gap-` utilities which map directly to this scale (`p-2` = 8px, `p-4` = 16px, etc.).

### 4.2 Card Specifications

| Property         | Value             | Notes                                           |
|------------------|-------------------|-------------------------------------------------|
| Padding (default)| 16px (sp-4)       | Used for compact cards (stats, list items)      |
| Padding (large)  | 24px (sp-6)       | Used for primary action cards, game cards       |
| Border radius    | 12px              | Default. Use `rounded-xl` in Tailwind.          |
| Border radius lg | 16px              | For hero cards, game selection cards. `rounded-2xl`. |
| Box shadow       | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | Resting state |
| Box shadow hover | `0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)` | Hover state  |
| Background       | `--color-surface` (#FFFFFF) | Always white surface on warm-cream background |
| Border           | `1px solid #F1F5F9` (slate-100) | Subtle definition without heavy visual weight |

### 4.3 Button Specifications

| Property          | Value              | Notes                                             |
|-------------------|--------------------|---------------------------------------------------|
| Min height        | 48px               | WCAG touch target requirement                     |
| Min width         | 48px               | Same                                              |
| Padding (default) | 12px 24px          | Standard button                                   |
| Padding (large)   | 16px 32px          | Primary action buttons in child views             |
| Border radius     | 10px               | Rounded but not pill-shaped. `rounded-[10px]`.    |
| Font size         | `body` or `body-lg`| Match surrounding context                        |
| Font weight       | 600 (semibold)     | Buttons are always semibold                       |
| Gap between       | 8px minimum        | Between adjacent buttons. Never less.             |
| Icon + label gap  | 6px                | Space between leading/trailing icon and label     |

**Button variants:**

- **Primary:** `--color-primary` background, white text. Used for the main action on any screen.
- **Secondary:** white background, `--color-primary` border (1.5px), `--color-primary` text. Used for secondary actions.
- **Ghost:** transparent background, `--color-muted` text. Used for tertiary actions (cancel, back).
- **Danger:** `--color-error` background, white text. Used only for destructive actions.
- **Answer (game):** Full-width, 64px min height on mobile, uses the dedicated answer-button color per slot (A/B/C/D). Never used outside the trivia game.

### 4.4 Layout Structure

**Sidebar navigation (desktop)**

- Width: 280px, fixed position
- Background: `--color-surface` (#FFFFFF)
- Border-right: `1px solid #F1F5F9`
- Contains: logo (top), nav links, user avatar + name (bottom)
- Nav item height: 48px, horizontal padding 16px
- Active nav item: `--color-primary` left border (3px), light primary background tint (5% opacity)

**Main content area**

- Left margin: 280px (sidebar width) on desktop
- Max content width: 1280px, centered with `margin: 0 auto`
- Content padding: 32px top/right/bottom, 40px on large screens
- On mobile: no sidebar, content is full width, padding 16px

**Top bar (mobile)**

- Height: 56px
- Contains: hamburger menu (left), page title (center), contextual action (right)
- Background: `--color-surface`
- Box shadow: `0 1px 0 #F1F5F9`

**Bottom navigation (mobile, child role only)**

- Height: 64px + safe-area-inset-bottom
- Contains: 3 tabs — "Jugar" (game controller icon), "Mis Puntos" (star icon), "Mis Badges" (badge/medal icon)
- Active tab: `--color-primary` icon + label, colored indicator dot above icon
- Background: white, top border 1px #F1F5F9

### 4.5 Grid Systems

| Context              | Columns | Gap  | Breakpoint trigger |
|----------------------|---------|------|--------------------|
| Game selection cards | 1 col   | 16px | < 640px (mobile)   |
| Game selection cards | 2 cols  | 16px | 640–1024px         |
| Game selection cards | 3 cols  | 24px | > 1024px           |
| Badge collection     | 3 cols  | 12px | < 640px            |
| Badge collection     | 4 cols  | 16px | 640–1024px         |
| Badge collection     | 6 cols  | 16px | > 1024px           |
| Dashboard stats      | 1 col   | 16px | < 640px            |
| Dashboard stats      | 2 cols  | 16px | 640–1024px         |
| Dashboard stats      | 4 cols  | 24px | > 1024px           |

---

## 5. Component Specifications

### 5.1 Trivia Game Flow

The game flow is the most complex interaction sequence in the system. It must be treated as a self-contained experience. Once a game starts, the navigation sidebar hides and the game occupies the full screen.

#### 5.1.1 Game Selection Screen

**Layout:** Grid of game cards (see grid spec above). Page title: "Elige un Juego" (h1, centered on mobile, left-aligned on desktop).

**Game Card anatomy:**

```
+------------------------------------------+
|  [Game Icon - 72x72px, centered]         |
|                                          |
|  Game Name (h3, center-aligned)          |
|  [Type Badge]  Brief description (body)  |
|                                          |
|  [    Jugar    ]  <- Primary button      |
+------------------------------------------+
```

- Game icon: 72x72px, colorful illustration or emoji-style icon. Do not use stock photography.
- Type badge: small pill (height 24px, horizontal padding 8px, font-size 12px). Colors: "Biblica" = primary, "Memoria" = secondary, "Rapidez" = accent.
- Description: max 2 lines, truncated with ellipsis at overflow. `body-sm` size, `--color-muted` color.
- "Jugar" button: primary variant, full width of card.
- Card hover state: `transform: scale(1.02)`, elevated box shadow. Transition: 150ms ease-out.
- Card focus state: standard 3px focus ring on the card container (the card itself is the focusable element wrapping the button for keyboard navigation simplicity — OR the button alone carries focus, not both).

**Accessibility annotations:**
- Card title announced as heading level 3.
- Type badge text included in button aria-label: `aria-label="Jugar Busqueda Biblica, tipo Biblica"`.
- If a game is unavailable (e.g., requires a session not yet started), render the card but replace "Jugar" with "No disponible" (ghost variant, disabled state). Do not hide the card.

#### 5.1.2 Game Loading Screen

**Purpose:** Prevent blank screen during game data fetch. Target load time < 1.5 seconds; this screen should rarely be seen for more than 1 second.

**Layout:** Full screen, `--color-bg` background, vertically and horizontally centered content.

**Content:**

```
[Bouncing Animation Element - 80px]
"Preparando tu juego..."  (h2, --color-muted)
[Subtle pulsing dots indicator below text]
```

- Animation element options (choose one per game type): bouncing Bible icon, spinning cross, bouncing star. Implemented in CSS (`@keyframes bounce`) not via a JS library.
- Pulsing dots: three 10px circles, sequential opacity animation (0.3 → 1 → 0.3), staggered by 150ms each.
- `prefers-reduced-motion`: replace all animations with a static spinner or just the text. No movement.

#### 5.1.3 Question Screen

**Layout:** Full-screen game view. Navigation is hidden. Three vertical zones.

**Zone 1 — Top bar (fixed height: 64px):**

```
[Progress dots]          [Score badge]
[Timer bar — full width below these two]
```

- Progress dots: one dot per question. Current question dot is filled (`--color-primary`, 12px diameter). Answered dots are filled (`--color-success`, 10px). Unanswered are outlined (`--color-muted`, 10px). Dots are equally spaced. Maximum 10 dots (if a game has more questions, use "3/10" text instead).
- Score badge: small pill showing current score, `--color-secondary` background, white text, `body-sm` bold.
- Timer bar: full-width colored bar below the dots. Height 8px, `border-radius: 4px`. Color transitions: > 50% remaining = `--color-success`, 25–50% = `--color-warning`, < 25% = `--color-error`. Width shrinks from 100% to 0% over the time limit via CSS `transition: width Xs linear`. Transitions are linear (not ease) so the progress is perceptually honest.

**Zone 2 — Question (flexible, centered vertically in remaining space):**

- Question text: h3 size (24px), font-weight 600, centered, max-width 640px, horizontal padding 24px.
- Optional image: if question has an associated image, it renders above the question text, max height 200px, `object-fit: contain`, with descriptive alt text.
- No decorative elements in this zone. The question must have maximum visual prominence.

**Zone 3 — Answer buttons (bottom, fixed to bottom of screen on mobile):**

```
+------------------+  +------------------+
|   A: [answer]    |  |   B: [answer]    |
+------------------+  +------------------+
+------------------+  +------------------+
|   C: [answer]    |  |   D: [answer]    |
+------------------+  +------------------+
```

- 2x2 grid on all screen sizes (including mobile). Each button is 50% of available width minus gap.
- Button height: minimum 72px on mobile, 64px on desktop.
- Font size: `body-lg` (18px) for answer text, `body-sm` for the letter prefix (A/B/C/D).
- Letter prefix is displayed in a small circle (24px diameter) in the top-left of the button, with the answer color at 30% opacity as background.
- Background colors: A=`answer.a` (#3B82F6), B=`answer.b` (#22C55E), C=`answer.c` (#F97316), D=`answer.d` (#8B5CF6).
- Text color: white on all answer backgrounds (all pass WCAG AA against white text).
- Hover state: `filter: brightness(1.1)`, `transform: scale(1.02)`. Transition: 100ms ease-out.
- Once an answer is selected: all other buttons become non-interactive (`pointer-events: none`).

**Keyboard controls (required):**
- Keys `1` or `A` → select answer A
- Keys `2` or `B` → select answer B
- Keys `3` or `C` → select answer C
- Keys `4` or `D` → select answer D
- `Enter` or `Space` on focused button → select that answer

**Accessibility annotations:**
- `role="group"` on the answer buttons container with `aria-label="Opciones de respuesta"`.
- Each button: `aria-label="Opcion A: [answer text]"`.
- Timer bar: `role="progressbar"`, `aria-valuenow={remainingPercent}`, `aria-label="Tiempo restante"`.
- Score: `aria-live="polite"` so score updates are announced without interrupting.

#### 5.1.4 Answer Feedback State

This state overlays the question screen for 2 seconds before auto-advancing. No user action is needed.

**Correct answer:**
- The selected button: background flashes to solid `--color-success`, white checkmark icon appended to text. Transition: 80ms.
- All other buttons: `opacity: 0.4` (dimmed, not hidden — screen readers still see them).
- Confetti: 50 particles launched from the selected button's position. Particle colors: primary, success, warning, secondary. Gravity effect (particles arc up then fall). Duration: 3 seconds. Canvas overlay, `pointer-events: none`. MUST be disabled under `prefers-reduced-motion`.
- "+X pts" float: a badge with the points value rises from the button center, fades out over 1 second. Font: h3 bold, color: `--color-success`, background white, border-radius 8px, subtle shadow.
- Screen reader announcement: `aria-live="assertive"` region announces "Correcto! Ganaste X puntos."

**Incorrect answer:**
- The selected button: background flashes to `--color-error` at 80% opacity (soft, not harsh). Red X icon appended to text. Transition: 80ms.
- The correct answer button: transitions to solid `--color-success` after 300ms, so the child sees the right answer.
- "Casi!" message: centered text in h3 below the answer grid. `--color-error` color, appears with a subtle `fadeIn` animation.
- All buttons non-interactive for 2 seconds.
- Screen reader announcement: `aria-live="assertive"` region announces "Incorrecto. La respuesta correcta era [correct answer text]."

**Auto-advance:**
- After 2 seconds, transition to the next question (or results screen) with a fade transition (200ms).
- If time runs out with no answer selected: treated as incorrect, correct answer highlights, "Se acabo el tiempo!" message instead of "Casi!".

#### 5.1.5 Results Screen

Shown after the final question is answered or time runs out.

**Layout:** Full screen, centered content, `--color-bg` background.

**Content blocks (vertical flow, center-aligned):**

**Block 1 — Score display:**
- Large score number: `display` token (48px, extrabold), `--color-text`.
- "puntos" label below score, h4, `--color-muted`.
- Stars animation: 1–3 stars filled based on performance (1 = < 50%, 2 = 50–79%, 3 = 80%+). Stars are 48px SVG icons in `--color-warning`. They "pop" in with a scale animation (0 → 1.2 → 1.0) staggered by 200ms each. Under `prefers-reduced-motion`, show all stars without animation.

**Block 2 — Performance breakdown:**
- "X / Y correctas" — `body-lg`, semibold.
- "Tiempo total: Xs" — `body`, `--color-muted`.
- These sit in a light surface card (white, `rounded-xl`, `p-4`).

**Block 3 — Points earned:**
- "Ganaste X puntos esta partida" — `body-lg`.
- The X value is an animated counter: counts up from 0 to the actual value over 500ms using a linear easing. Under `prefers-reduced-motion`, show the final value immediately.
- Background: subtle `--color-success` tint (10% opacity) card.

**Block 4 — New badges earned (conditional, only shown if badges were earned):**
- Section title: "Nuevos Logros!" — h2.
- Row of badge cards (see badge card spec in 5.3). Each badge card has a gold glow animation on entrance.
- If no badges earned: this block is not rendered. Do not show an empty "no new badges" state here — it deflates the moment.

**Block 5 — Leaderboard position:**
- "Eres #X en el leaderboard!" — h3, `--color-secondary`.
- If rank improved since last game: "Subiste X posiciones!" in `--color-success`.

**Block 6 — Action buttons:**
- "Jugar de nuevo" — primary button.
- "Ver Leaderboard" — secondary button.
- Arranged horizontally, centered, with 12px gap.

---

### 5.2 Leaderboard (Projection Mode)

The leaderboard has two display modes: **embedded** (in the app sidebar/page for normal browsing) and **projection** (full-screen for display during church service on a projector or large screen).

#### 5.2.1 Projection Mode

Activated when the browser viewport width exceeds 1920px, OR when a leader/admin clicks "Modo Proyeccion" which triggers full-screen via the Fullscreen API.

**Background:** `#0F172A` (slate-900). Dark background for projector legibility and drama.

**Season info bar (top, full width):**
- Season name: h2, white.
- Date range: `body`, `--color-muted` (light slate).
- Centered in a 48px tall bar. Subtle bottom border: 1px `rgba(255,255,255,0.1)`.

**Top 3 Podium:**

The three podium platforms are the visual centerpiece. They sit in the upper-center of the screen.

```
           [#1 - CENTER - TALLEST]
[#2 - LEFT]                        [#3 - RIGHT]
  [platform]    [platform: 100%]    [platform]
  height: 60%   height: 100%       height: 45%
```

Podium column specs:
- Columns are 280px wide on 1920px viewport, scaling proportionally.
- Gap between columns: 24px.
- Platform "pedestal" block height ratios: #1 = 100%, #2 = 60%, #3 = 45%.
- Pedestal colors: #1 = `#FFD700` (gold), #2 = `#C0C0C0` (silver), #3 = `#CD7F32` (bronze). Semi-transparent (70% opacity) to look like colored glass on the dark background.

Each podium entry contains (top to bottom above the pedestal):
- Crown icon (48px) — only for #1, gold color.
- Avatar circle (80px diameter) — colored initial avatar or uploaded photo.
- Player name: h2, white, centered.
- Score: `display` size (48px), colored to match tier (gold/silver/bronze), bold.
- Medal icon (40px) below the name.

**Entrance animation:**
- On first render or scene change: all three columns slide up from below the viewport with a staggered delay (#3 first, 0ms; #2 at 100ms; #1 at 200ms). Duration: 600ms, `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like ease-out). Under `prefers-reduced-motion`: no entrance animation, elements appear immediately.

**Rankings 4–10 (below podium):**

Clean list below the podium. Each row:
- Height: 64px.
- Contains: rank number (h3, `--color-muted`), avatar (40px), name (h3, white), score (h3, white, right-aligned).
- Alternating row backgrounds: odd rows transparent, even rows `rgba(255,255,255,0.04)`.
- Row left padding: 32px, right padding: 32px.
- Max-width: 960px, centered on screen.

**Live updates:**
- When a child's score changes, the affected row slides to its new ranked position using a CSS transform animation.
- Duration: 400ms, `ease-out`.
- During the transition, the row highlights briefly with a gold background flash (200ms).
- After position change: rank numbers of all displaced rows also update with a fade transition (150ms).
- Score changes poll or subscribe via WebSocket (implementation detail for backend team — the frontend component accepts a `scores` prop and re-sorts + animates whenever the array changes).
- Under `prefers-reduced-motion`: rows snap to new positions without animation.

#### 5.2.2 Embedded Mode (in-app leaderboard page)

- Light background (`--color-bg`).
- No podium visualization. Simple ranked list.
- Top 3 rows have a badge icon (gold/silver/bronze) prepended to the rank number.
- The currently logged-in user's row is highlighted with a `--color-primary` left border (3px) and light primary background tint.
- Pagination: "Ver mas" button at bottom loads 10 more entries (not full infinite scroll, to avoid disorienting children).

---

### 5.3 Badge System

#### 5.3.1 Badge Card (Collection View)

Used in the badge grid view. Two states: earned and locked.

**Earned badge card:**
```
+-----------------------------+
|  [Icon circle - 64px]       |
|  (full color, tier border)  |
|                             |
|  Badge Name (body, bold)    |
|  Earned: Jan 15 (caption)   |
+-----------------------------+
```

- Icon circle: 64px diameter. Background is tier color at 15% opacity. Icon (32px SVG) in full tier color.
- Border: 3px solid tier color. `border-radius: 50%`.
- Gold and Platinum tiers: add `box-shadow` glow (see section 2.3).
- Card background: white. `rounded-xl`. `p-3`.
- Earned date: `caption` size, `--color-muted`.

**Locked badge card:**
- Same layout as earned.
- Icon circle: grayscale filter (`filter: grayscale(1)`), 40% opacity.
- Lock icon overlay: 24px lock SVG centered over the icon circle, `--color-muted` color.
- Badge name: `--color-muted`, not bold.
- Criteria text replaces earned date: "Completa 10 lecturas" in `caption` size, `--color-muted`. This is the only text hint shown — no numbers like "7/10 done" in the card (that level of detail belongs in a badge detail modal).

**Badge card hover (earned only):**
- `transform: scale(1.05)`, elevated shadow. 150ms ease-out.
- Click opens a badge detail modal.

**Badge detail modal:**
- Title: badge name (h2).
- Large icon: 120px.
- Description: what this badge represents (body).
- Earned date or "Bloqueado".
- Criteria: full description of how to unlock, with a progress bar if partially completed.
- "Cerrar" button.

#### 5.3.2 New Badge Toast

Appears when a badge is earned during a session (after a game, after a reading, etc.).

- Position: fixed, bottom-right on desktop; bottom-center on mobile.
- Slides in from the right edge (desktop) or bottom (mobile). 300ms `ease-out`.
- Auto-dismisses after 6 seconds. Manual dismiss with an X button.
- Width: 320px (desktop), full width minus 32px margin (mobile).
- Background: white. Border: 2px solid `--color-warning` (`#FFD700`). `rounded-2xl`. Shadow: elevated.
- Gold pulsing border animation: the border color pulses between `#FFD700` and `#FFEDD5` (orange-100), cycling every 1 second for 3 cycles, then stops. Under `prefers-reduced-motion`: static gold border.
- Content: small badge icon (40px), "Nuevo Logro!" label (`body-sm`, `--color-warning`, semibold), badge name (body, bold), tier label.
- A fanfare sound plays on entrance (described — not implemented; sound system TBD).

#### 5.3.3 Badge Collection Layout

- Section header: "Mis Logros" (h1) + earned count summary "12 de 24 logros" (`body-lg`, `--color-muted`).
- Earned badges display first, sorted by earn date (most recent first).
- Locked badges display after a "Logros Bloqueados" divider heading.
- A search/filter bar (visible only on desktop) allows filtering by category (Lectura, Juegos, Asistencia, etc.).
- Progress indicator: linear progress bar between the heading and the grid. Shows "12 / 24" with the bar at 50%. Colors: `--color-primary` fill on `#E2E8F0` (slate-200) track.

---

### 5.4 Points & Feedback System

#### 5.4.1 +Points Toast (Floating Feedback)

Used when a leader awards points outside the game context (attendance, bringing a Bible, etc.).

- A small badge animates from the source element (the button clicked by the leader, or the player's row in a table).
- The badge rises 48px upward and fades out over 1 second.
- Positive (points added): green background (`--color-success`), white text, "+" prefix. Example: "+2 pts".
- Negative (points removed): red background (`--color-error`), white text, "-" prefix. Example: "-2 pts".
- Font: `body-sm`, bold.
- `border-radius: 20px` (pill shape).
- Implementation note: the animation is a CSS `@keyframes` on a short-lived DOM element removed after the animation completes. Multiple toasts can be visible simultaneously if multiple rows are updated in rapid succession.

#### 5.4.2 Level Progress Bar

Shown at the top of the child dashboard below the welcome banner. This is the XP bar paradigm.

- Full width of the content area. Height: 20px. `border-radius: 10px`.
- Track: `#E2E8F0` (slate-200).
- Fill: gradient from `--color-primary` to `--color-secondary` (left to right).
- Current level shown left of the bar. Next level shown right of the bar. Both in `body-sm`, `--color-muted`.
- XP values shown inside/below the bar: "240 / 500 XP" in `caption`, centered.

**Level up animation:**
- When the bar reaches 100%, pause for 300ms.
- Then: confetti burst (same as correct answer, but from the bar's center), bar flashes white, level number increments with a scale animation (0.8 → 1.2 → 1.0), new target value updates.
- An overlay card appears: "Nivel X!" in `display` size, gold color, on a dark scrim. Auto-dismisses after 3 seconds. Under `prefers-reduced-motion`: instant transition, no confetti.

#### 5.4.3 Streak Indicator

A compact badge shown on the child dashboard and in the sidebar.

- Layout: fire icon (20px) + streak count (body-sm, bold) + "dias seguidos" label.
- Background: `--color-accent` (#F97316) at 10% opacity. Border: 1px solid `--color-accent`. `border-radius: 20px`. Padding: 4px 10px.
- Text color: `--color-accent`.
- At streaks of 7+ days: the fire icon is larger (24px) and has a subtle glow animation. Label changes to "Una semana seguida!".
- At streaks of 30+ days: icon is 28px, gold color, platinum-tier glow.
- If streak is broken: do not show a "broken streak" indicator. Simply reset to 0 on next login or remove the badge entirely until a new streak starts.

---

### 5.5 Reading Progress

#### 5.5.1 Reading Card (List View)

```
+--------------------------------------------------+
| [Book icon 32px]  Title (body-lg, bold)          |
|                   Reference (body-sm, muted)     |
|                   [Difficulty pill]              |
|                                   [Status icon] |
+--------------------------------------------------+
```

- Card height: minimum 80px, single-line truncation for title.
- Book icon: colored by category (Bible = primary, devotional = secondary).
- Reference: e.g., "Juan 3:16" or "Marcos 1:1-20". `body-sm`, `--color-muted`.
- Difficulty pill: height 24px, pill-shaped. "Facil" = `--color-success` background, "Medio" = `--color-warning` background, "Dificil" = `--color-error` background. White text, `caption` size.
- Status icon: right-aligned. Not started = nothing. In progress = half-filled circle icon, `--color-primary`. Completed = solid checkmark circle, `--color-success`.
- Completed cards: the status icon persists. The card is not visually dimmed — completed readings are achievements, not clutter.

#### 5.5.2 Reading View

Full-screen reading experience. Navigation sidebar hides (same as game mode).

- Background: `--color-surface` (#FFFFFF). Not warm cream — white is easier for long-form reading.
- Content column: max-width 680px, centered, horizontal padding 24px.
- Typography: see section 3.4 (reading view typography).
- Top bar: back arrow (left), reading title (center, h4), difficulty pill (right).
- Progress indicator: a thin (4px) progress bar at the very top of the screen (above the top bar), `--color-primary` fill, updates as the user scrolls.

#### 5.5.3 Reading Completion

Triggered when the user scrolls to the bottom and activates "Marcar como Completado" button.

- Button: primary variant, full-width on mobile, centered fixed at bottom of screen.
- On tap: the button's icon changes to a spinning loader (150ms), then to a checkmark.
- The reading card in the list view updates: status icon becomes solid checkmark, `--color-success`.
- Points awarded display: the +Points float (see 5.4.1) animates from the completion button.
- Completion overlay: a brief (2 second, auto-dismiss) overlay card shows: large checkmark (64px, `--color-success`), "Lectura completada!", points earned. Underneath: "Bien hecho, [Name]!" in h3.

---

### 5.6 Dashboard Layouts by Role

All dashboards share the same shell: sidebar (desktop), top bar (mobile), bottom nav (child on mobile).

#### 5.6.1 Child Dashboard

URL: `/child/dashboard`

**Welcome banner (full width card, `--color-primary` gradient background):**
- Avatar (56px circle) left-aligned.
- "Hola, [Name]!" — h1, white.
- Streak indicator (see 5.4.3) — right side of banner.
- Background: gradient from `--color-primary` to `--color-secondary`.

**Quick stats row (3 stat cards):**

| Card         | Value       | Icon         | Color hint         |
|--------------|-------------|--------------|---------------------|
| Puntos       | Total score | Star icon    | `--color-warning`  |
| Posicion     | #X          | Trophy icon  | `--color-accent`   |
| Lecturas     | X completadas | Book icon  | `--color-success`  |

Each stat card: white background, `rounded-xl`, `p-4`. Icon is 32px, colored. Value in h2 (bold). Label in `body-sm`, `--color-muted`.

**Three primary action cards (large, 2-column grid on mobile, 3-column on desktop):**

```
+---------------+  +---------------+  +-------------------+
|  [Game icon   |  |  [Book icon   |  |  [Badge icon      |
|   80px]       |  |   80px]       |  |   80px]           |
|               |  |               |  |                   |
|  "Jugar"      |  |  "Leer"       |  |  "Mis Badges"     |
|  (h2)         |  |  (h2)         |  |  (h2)             |
+---------------+  +---------------+  +-------------------+
```

- Cards are larger than stat cards: `p-6`, min-height 160px.
- Icon is centered above the text.
- Entire card is clickable/tappable. Hover: scale up + shadow (see card spec).

**Recent activity feed (last 5 events):**
- Section title: "Actividad Reciente" (h3).
- Each item: icon (20px, colored by type), description text (`body`, bold name + `body-sm` action), time ago (`caption`, `--color-muted`).
- "Ver todo" link at bottom of list.

#### 5.6.2 Parent Dashboard

URL: `/parent/dashboard`

**Child selector (if the parent has multiple children enrolled):**
- Horizontal scrolling pill list of children's names.
- Active child: `--color-primary` background, white text. Inactive: outline style.
- Switching child re-renders the dashboard content below with a fade transition.

**Child summary card:**
- Same layout as the child quick stats row (points, position, readings).
- Read-only. No action buttons.
- Includes: last activity date at the bottom of the card.

**Progress comparison chart:**
- Section title: "Esta Semana vs Semana Pasada" (h3).
- Simple bar chart: two bars per day (Mon–Sun), this week (`--color-primary`) vs last week (`--color-muted`). Bar height proportional to points earned that day.
- Chart library: use a lightweight option (Recharts or Chart.js — implementation team to decide). Must be accessible (SVG with `<title>` and `<desc>` elements, data table fallback available via a toggle).
- No interaction required. Static display.

**Recent activity feed:** Same component as child dashboard, scoped to that child's activities.

#### 5.6.3 Leader Dashboard

URL: `/leader/dashboard`

**Quick-action bar (sticky, below top bar on mobile; fixed in content area top on desktop):**
- Three primary action buttons in a row:
  - "Tomar Asistencia" — primary variant, clipboard icon.
  - "Dar Puntos" — secondary variant, star icon.
  - "Nueva Lectura" — secondary variant, book icon.
- On mobile: this bar is full-width, each button is equal width (flex: 1). Height: 56px.

**Today's stats row (4 stat cards):**

| Stat              | Description                    |
|-------------------|--------------------------------|
| Ninos presentes   | Count of attendance taken today |
| Puntos entregados | Sum of points given today       |
| Juegos jugados    | Games played today              |
| Lecturas hechas   | Readings completed today        |

**Activity feed:**
- More detailed than the child version. Shows: which leader gave which points to which child, timestamps, reading completions, new badge awards.
- Filterable by activity type via a pill-filter row (all / puntos / lecturas / juegos / asistencia).

**Alerts section (conditional — only shown if there are alerts):**
- Section with a soft orange-tinted background card.
- Title: "Atencion" + warning icon. `--color-accent`.
- List of alerts: children who have not logged in for 2+ weeks, pending badge approvals, etc.
- Each alert has a direct action button ("Ver perfil", "Aprobar", etc.).

#### 5.6.4 Admin Dashboard

URL: `/admin/dashboard`

The admin dashboard extends the leader dashboard. All leader sections are present, plus:

**System overview bar (top, 4 stat cards):**

| Stat              | Description                     |
|-------------------|---------------------------------|
| Usuarios totales  | Total registered users          |
| Temporada activa  | Current season name + time left |
| Badges pendientes | Badges awaiting approval        |
| Lideres activos   | Count of leader-role users      |

**Tabbed secondary panel:**
- Tabs: "Usuarios", "Temporadas", "Juegos", "Configuracion".
- Each tab shows the relevant management table or form.
- This is the primary place for system configuration — it is deliberately behind a tab (not on the main dashboard) to apply progressive disclosure for admin complexity.

---

## 6. Responsive Breakpoints

Breakpoints are defined as CSS custom properties and Tailwind screen tokens.

| Name       | Range             | Layout behavior                                                            |
|------------|-------------------|----------------------------------------------------------------------------|
| Mobile     | 0 – 639px         | Single column. Bottom navigation (child). Hamburger menu (adult roles). Full-width cards. |
| Tablet     | 640px – 1023px    | Sidebar collapses to icon-only (48px). 2-column card grids. No bottom nav. |
| Desktop    | 1024px – 1919px   | Full 280px sidebar. 3–4 column grids. All panels visible.                  |
| Projection | 1920px+           | Leaderboard mode. Extra-large text. Dark background. Podium visualization. |

In Tailwind CSS 4, configure:

```js
// tailwind.config.js (screens section)
screens: {
  'sm':  '640px',
  'md':  '1024px',
  'lg':  '1280px',
  'xl':  '1920px',  // Projection breakpoint
}
```

### Mobile-Specific Patterns

- The bottom navigation replaces the sidebar for children on mobile. Adult roles use a slide-in overlay sidebar (triggered by hamburger), not bottom nav.
- Forms use full-screen modals on mobile rather than inline panels.
- The trivia game answer grid is 2x2 on all sizes including mobile — never stack to 1 column, as that breaks the visual metaphor.
- Tables (leader/admin views) collapse to card-based list views on mobile. Each row becomes a card with labeled fields.

### Tablet-Specific Patterns

- The sidebar shows icons only (no labels) at 640–1023px. A tooltip on icon hover shows the label.
- The trivia timer bar font labels ("00:15") are hidden; only the bar itself is visible.
- Game selection shows 2-column grid.

### Projection-Specific Patterns

- All padding and font sizes scale up by 1.25x from desktop values.
- The navigation is hidden entirely.
- Only the leaderboard component renders.
- The title bar shows the season name in large type.

---

## 7. Animation Guidelines

All animations must have a corresponding `prefers-reduced-motion` safe fallback. The implementation pattern is:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The confetti system must also check this preference at runtime before initializing particles.

### 7.1 Timing Reference

| Animation                   | Duration | Easing                              | Notes                                           |
|-----------------------------|----------|-------------------------------------|-------------------------------------------------|
| Page transition (fade+slide)| 200ms    | `ease-out`                          | Slight 8px upward slide + opacity 0→1           |
| Card hover                  | 150ms    | `ease-out`                          | `scale(1.02)` + shadow elevation change         |
| Button press                | 100ms    | `ease-in`                           | `scale(0.97)` on `:active`                      |
| Score counter               | 500ms    | Linear                              | Numeric count-up from 0 to final value          |
| Confetti burst              | 3000ms   | Gravity curve (custom `@keyframes`) | 50 particles, stagger start by 0–300ms randomly |
| Leaderboard position change | 400ms    | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out) | Row translates to new y-position     |
| Badge entrance (toast)      | 300ms    | `cubic-bezier(0.16, 1, 0.3, 1)`     | Slide + spring feel                             |
| Level up bar fill           | 800ms    | `ease-in-out`                       | Bar fill width animates to 100%                 |
| Points float                | 1000ms   | `ease-out`                          | Rise 48px, opacity 1→0                          |
| Answer button flash         | 80ms     | Linear                              | Background color swap                           |
| Correct answer confetti     | 3000ms   | —                                   | Canvas overlay, removed after completion        |
| Podium entrance (projection)| 600ms    | `cubic-bezier(0.16, 1, 0.3, 1)`     | Slide up from bottom, staggered                 |
| Star pop (results screen)   | 300ms    | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `scale(0 → 1.2 → 1.0)`, spring bounce          |

### 7.2 Sound Effects (Design Intent)

Sound is not implemented in v2 but the design specifies the intended sound design for future implementation. Each event has a distinct sound to reinforce meaning:

| Event               | Sound description                                        |
|---------------------|----------------------------------------------------------|
| Correct answer      | Bright upward chime (2-note ascending, major interval)  |
| Incorrect answer    | Soft low "bonk" (not harsh or punishing)                |
| Points added        | Short coin-clink sound                                  |
| Badge earned        | 3-note fanfare (ascending, triumphant)                  |
| Level up            | Full 5-note celebration jingle                          |
| Game start          | Upbeat short jingle (1 second)                          |
| Timer warning (<25%)| Soft ticking sound, repeating                           |
| Time expired        | Low descending tone                                     |

All sounds must respect the user's system volume and must be mutable via a toggle in the child dashboard settings.

### 7.3 Transition Choreography

For page-to-page transitions within the game flow, maintain spatial consistency so children build a mental model:

- Moving forward (game selection → loading → question → results): content slides/fades from right to left.
- Moving backward (results → game selection): content slides/fades from left to right.
- Opening modals: content fades in, scrim fades in simultaneously. Modals do not slide from edges.
- Closing modals: content fades out, scrim fades out. Faster than open (100ms vs 200ms).

---

## 8. Accessibility Requirements

This section defines non-negotiable requirements. Every component in the system must satisfy all applicable items before being considered complete.

### 8.1 Contrast Requirements

| Element type                | Minimum ratio | Checked against         |
|-----------------------------|---------------|-------------------------|
| Normal body text            | 4.5:1         | Background color        |
| Large text (18px+ or 14px+ bold) | 3:1      | Background color        |
| UI component borders        | 3:1           | Adjacent color          |
| Focus ring                  | 3:1           | Adjacent background     |

All answer button colors (A/B/C/D) must be tested with white text. All four pass at their specified hex values:
- A (#3B82F6 blue-500 + white): 3.95:1 — passes for large text (all answer text is 18px+)
- B (#22C55E green-500 + white): 2.72:1 — fails for body text. Use white text only and increase to `#16A34A` (green-600) on the button background to achieve 3.54:1 for large text. **Implementation note: use `#16A34A` for the B answer button, not `#22C55E`.**
- C (#F97316 orange-500 + white): 2.78:1 — same issue. Use `#EA580C` (orange-600) to achieve 3.14:1 for large text. **Use `#EA580C` for C answer button.**
- D (#8B5CF6 violet-500 + white): 3.49:1 — passes for large text.

This adjustment applies only to answer buttons. For all other usage of `--color-success` and `--color-accent` (non-button contexts with smaller text), use them on light backgrounds only.

### 8.2 Focus Management

- All interactive elements receive a visible focus ring: `outline: 3px solid #3B82F6; outline-offset: 2px;`.
- Never use `outline: none` without providing an equivalent custom focus indicator.
- Focus must be managed programmatically on route changes: when a new page loads, focus moves to the main content area `<main>` element (or the first heading within it).
- When a modal opens, focus moves to the first interactive element inside the modal.
- When a modal closes, focus returns to the element that triggered the modal.
- During the trivia game, when a new question loads, focus moves to the question text element (via `tabIndex={-1}` + `.focus()`).

### 8.3 ARIA Landmarks and Roles

Every page must have the following landmark structure:

```html
<header role="banner">         <!-- Top bar / sidebar header -->
<nav role="navigation">        <!-- Sidebar nav or bottom nav -->
<main role="main">             <!-- Primary content area -->
<aside role="complementary">   <!-- Stats panel, activity feed -->
<footer role="contentinfo">    <!-- App footer if present -->
```

Game-specific ARIA requirements:
- Game container: `role="application"` with `aria-label="Juego de trivia"`.
- Question text: `aria-live="polite"` so it is announced when it changes.
- Timer bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Tiempo restante"`.
- Answer selected / result: `role="alert"` on the feedback region (this uses `aria-live="assertive"` implicitly).
- Score: `aria-live="polite"`, `aria-atomic="true"`.

### 8.4 Keyboard Navigation

**Global:**
- All interactive elements reachable by `Tab` in logical DOM order.
- All interactive elements activatable by `Enter` (links, buttons) or `Space` (buttons, checkboxes).
- Dropdown menus: opened with `Enter`/`Space`, navigated with arrow keys, closed with `Escape`.
- Modals: closed with `Escape`. Focus trapped within open modal.

**Trivia game (full keyboard support required):**
- Keys `1`, `2`, `3`, `4` map to answers A, B, C, D respectively.
- Keys `A`, `B`, `C`, `D` also map to the corresponding answer.
- `Tab` cycles through the four answer buttons (for users who prefer Tab over shortcut keys).
- `Enter` or `Space` on a focused answer button selects that answer.
- During feedback (2-second pause before auto-advance): no input accepted; announce the outcome via `aria-live` region.
- All keyboard shortcuts are announced in an `aria-describedby` instruction shown before the game starts ("Usa las teclas 1, 2, 3, 4 para responder").

### 8.5 Images and Icons

- All decorative icons: `aria-hidden="true"`. They are accompaniments to text and must never carry meaning alone (the text is always present).
- All functional icons (e.g., icon-only buttons): the button must have `aria-label` describing the action. Example: `<button aria-label="Cerrar modal">` with an X icon inside.
- Trophy icons, badge icons on leaderboard: `aria-hidden="true"` — the surrounding text provides context.
- Game illustrations on the selection screen: meaningful alt text describing what the illustration depicts, even if decoratively intended.
- Player avatars: `alt="[Player name]"` or `alt="Avatar de [Player name]"`.

### 8.6 Color Independence

Every status communicated by color must also be communicated by one of: icon, pattern, text, or shape. Examples:
- Answer feedback: not just color change (green/red), but also a checkmark icon (correct) and X icon (incorrect).
- Difficulty pills: not just color, but also the text label ("Facil", "Medio", "Dificil").
- Leaderboard position change: not just a color flash, but also an upward arrow icon.
- Streak fire icon: color is purely additive; the fire icon and the numeric count carry the meaning.

### 8.7 Touch Targets

- Minimum touch target: 48x48px for all interactive elements.
- Minimum gap between adjacent touch targets: 8px.
- For answer buttons specifically: target fills the entire button area (no internal padding that reduces the hit area). At 72px height on mobile, this is well satisfied.
- Checkboxes and radio buttons: wrapped in a label element to extend the touch target to include the label text.

---

## 9. Error & Empty States

### 9.1 Empty States

Empty states occur when a list or feed has no data yet. They must not feel like errors — they are invitations to take action.

**Empty leaderboard:**
- Illustration: cartoon kids looking up at a trophy (SVG, max 200px).
- Heading: "Aun no hay puntos" (h2).
- Body: "Juega para ganar tu primer puesto!" (`body-lg`, `--color-muted`).
- Action button: "Ir a Jugar" (primary).

**Empty badges collection:**
- Illustration: a box with a question mark.
- Heading: "Todavia sin logros" (h2).
- Body: "Completa lecturas y juegos para ganar tu primer badge." (`body-lg`, `--color-muted`).
- No action button (badges are earned, not explicitly actioned).

**Empty activity feed:**
- Inline (no illustration): "Sin actividad reciente" in `body`, `--color-muted`, centered in the feed area.

**Empty game list:**
- Illustration: game controller with a lock.
- Heading: "No hay juegos disponibles" (h2).
- Body: "El lider aun no ha activado juegos para esta temporada." (`body`, `--color-muted`).

**General pattern:**
- Illustration: always present for full-page empty states, optional for inline.
- Heading: short, plain language, no technical terms.
- Body: single sentence, explains why and what to do.
- Action: present only if the user can take a meaningful action to fill the empty state.
- Never use: sad or negative language ("No tienes nada aqui", "No encontramos resultados"). Use curious/inviting language instead.

### 9.2 Error States

Errors must never be alarming. They must be clear about what happened and what to do next.

**Inline field validation errors:**
- Below the field, `body-sm`, `--color-error`.
- Icon: small warning triangle (16px) before the text.
- The field border changes to `--color-error` (1.5px solid).
- The field label does NOT change color (it remains readable in `--color-text`).
- Example: "El nombre es obligatorio" not "Error: campo requerido".

**Toast error (operation failed):**
- Same position and size as the badge toast.
- Background: white. Left border: 4px solid `--color-error`.
- Icon: 32px warning icon in `--color-error`.
- Heading: "Algo salio mal" (`body`, bold).
- Body: human-readable description. Example: "No se pudo guardar. Intenta de nuevo." (`body-sm`).
- Action: "Intentar de nuevo" button (outline/secondary style).
- Auto-dismisses after 8 seconds (longer than badge toast, as errors require reading).

**Full-page error (route not found, server down):**
- Friendly illustration (a confused-looking character, SVG, max 240px).
- Heading: varies by error type.
  - 404: "No encontramos esa pagina" (h1).
  - 500: "Algo fallo en el servidor" (h1).
  - Offline: "Sin conexion a internet" (h1).
- Body: plain language explanation (`body-lg`).
- Action: retry button (if relevant), or back/home button.
- Never display: HTTP status codes, stack traces, database error strings. These go to the console only.

**Network offline banner:**
- A slim (40px) banner at the very top of the app, above the top bar.
- Background: `--color-warning` at 15% opacity. Left border: 4px solid `--color-warning`.
- Icon: wifi-off icon (20px, `--color-warning`). Text: "Sin conexion. Mostrando datos guardados." (`body-sm`).
- If cached data is not available: the banner says "Sin conexion. Algunas funciones no estan disponibles."
- Disappears (slides up, 200ms) when connection is restored. A brief "Conexion restaurada" success toast appears at that moment.

### 9.3 Loading States

Loading states use skeleton screens that match the geometry of the final content. This prevents layout shift and reduces perceived wait time.

**Skeleton screen rules:**
- Skeleton blocks are `#F1F5F9` (slate-100) background with a subtle left-to-right shimmer animation (`background-position` animation from -200% to 200% on a gradient).
- Match the approximate dimensions and shape of the actual content:
  - Text lines: 80–100% width of the expected text, height 16px or 20px.
  - Avatar circles: same diameter as the actual avatar.
  - Cards: same height and border-radius as the real card.
- Under `prefers-reduced-motion`: remove the shimmer animation. Static slate-100 blocks only.
- Skeleton screens are shown for initial page loads and for major content refreshes.
- For fast operations (< 300ms expected), do not show a skeleton — show nothing and let the content appear directly. A skeleton that flashes in and immediately disappears is more disruptive than waiting.
- For any operation > 1 second: supplement the skeleton with the loading animation from section 5.1.2 if it is a full-screen operation (game load), or a subtle spinner in the content area for inline updates.

**Specific skeleton layouts:**

Dashboard stats row: render 4 skeleton cards at the correct card height (80px), each containing two skeleton text lines.

Leaderboard list: render 10 skeleton rows at 64px height each. Each row has a circle placeholder (40px) and two text line placeholders.

Badge grid: render 12 skeleton badge cards in the grid, each as a circle (64px) above two text line placeholders.

Game selection grid: render 6 skeleton game cards at the same height as real cards, each showing the icon placeholder (72px circle), two text lines, and a button placeholder.

---

## Appendix A: Component Checklist

Use this checklist before marking any component as "done":

- [ ] Renders correctly at all 4 breakpoints (mobile, tablet, desktop, projection if applicable)
- [ ] Passes WCAG AA contrast check (use browser DevTools accessibility panel)
- [ ] All interactive elements have visible focus rings
- [ ] All images have alt text
- [ ] All icon-only buttons have `aria-label`
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Touch targets are 48x48px minimum
- [ ] Empty state is designed and implemented
- [ ] Loading/skeleton state is designed and implemented
- [ ] Error state is handled gracefully
- [ ] Copy reviewed: no technical language, encouraging tone, Spanish throughout

---

## Appendix B: Design Token Quick Reference

```css
/* Base tokens — define in :root */
:root {
  /* Colors */
  --color-primary:   #3B82F6;
  --color-secondary: #8B5CF6;
  --color-accent:    #F97316;
  --color-success:   #22C55E;
  --color-warning:   #EAB308;
  --color-error:     #EF4444;
  --color-bg:        #FFF8F0;
  --color-surface:   #FFFFFF;
  --color-text:      #1E293B;
  --color-muted:     #64748B;

  /* Typography */
  --font-family:     'Inter', system-ui, sans-serif;
  --font-size-base:  1rem;        /* 16px */
  --font-size-child: 1.125rem;    /* 18px */

  /* Spacing */
  --sp-1:  4px;
  --sp-2:  8px;
  --sp-3:  12px;
  --sp-4:  16px;
  --sp-6:  24px;
  --sp-8:  32px;
  --sp-12: 48px;  /* Touch target minimum */

  /* Border radius */
  --radius-card: 12px;
  --radius-card-lg: 16px;
  --radius-button: 10px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-modal: 0 20px 60px rgba(0,0,0,0.2);

  /* Transitions */
  --transition-fast: 100ms ease-out;
  --transition-base: 150ms ease-out;
  --transition-slow: 200ms ease-out;
  --transition-spring: 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

*This document is the authoritative source for all UI/UX decisions in JordanList v2. When a developer and a designer disagree about implementation, this document resolves the dispute. When this document is silent on a topic, apply the four design principles in section 1 and document the decision made.*
