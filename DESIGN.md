---
name: Precision Luminescence
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b22'
  surface-container: '#1d1f26'
  surface-container-high: '#282a30'
  surface-container-highest: '#33343b'
  on-surface: '#e2e2ea'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e2e2ea'
  inverse-on-surface: '#2e3037'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#111319'
  on-background: '#e2e2ea'
  surface-variant: '#33343b'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies a forward-looking 2026 generative video creation workspace. It balances high-utility creative software with refined, luminous minimalism inspired by modern engineering powerhouses like Linear, Vercel, and Framer.

### Emotional Tenets & Voice
- **Effortless Mastery:** The interface recedes to let video content and generative timelines take center stage, giving creators the sensation of instantaneous, cinematic control.
- **Engineered Precision:** Razor-sharp typography, strict micro-layouts, and calculated contrast inspire trust in computationally intense AI operations.
- **Atmospheric Luminescence:** Deep, charcoal canvas layers infused with focused bursts of electric indigo, violet, and cyan convey state-of-the-art AI intelligence without visual clutter.

### Aesthetic Execution
A cohesive blend of **Dark-Mode Minimalism** and **Refined Glassmorphism**. The foundation relies on a tiered charcoal palette rather than pitch blacks, bound together by ultra-fine sub-pixel translucent borders, subtle surface-level gradients, and strategic frosted glass panels for floating overlays, timeline tools, and modals.

## Colors

The palette is tuned for high dynamic range contrast in low-light creative production environments, reducing eye fatigue during intensive editing sessions while maximizing spatial clarity.

### Surface Architecture
- **Base Canvas (`#0B0C10`):** The foundational viewport underlayment for canvas panning, video frame backdrops, and root shells.
- **Surface Layer 1 (`#12141A`):** The primary structural surface for sidebars, top navigation docks, timeline frames, and asset panels.
- **Surface Layer 2 (`#181B22`):** Elevated cards, dropdowns, contextual popovers, active tracks, and hovering toolbars.
- **Border Frame (`#232733`):** 1px structural dividing lines across panels and surfaces to preserve form definition without stark contrast.

### Accent & Energy Tokens
- **Electric Indigo (`#6366F1` - Primary):** High-confidence interaction targets, keyframe indicators, primary call-to-actions, and processing indicators.
- **Deep Violet (`#8B5CF6` - Secondary):** Multi-modal generative pathways, prompt injection surfaces, and gradient pairing transitions.
- **Luminous Cyan (`#06B6D4` - Tertiary):** Highlighting audio stems, vector track automation points, and real-time generation pulses.
- **Linear Gradient Signature:** `linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)` reserved for high-impact AI moments: prompt execution buttons, active generation rings, and premium milestone highlights.

### Typography Neutral Ramp
- **High-Contrast Text (`#F8FAFC`):** Primary headings, current layer titles, and active input strings.
- **Muted Label Text (`#94A3B8`):** Unselected tracks, secondary metrics, timeline tick labels, and inactive properties.
- **Subtle Hint Text (`#64748B`):** Keyboard shortcuts, deactivated statuses, and empty-state placeholders.

## Typography

The typographic hierarchy prioritizes rapid scanning, low cognitive fatigue, and precision timecode readability. 

- **Geist (Headings and Body):** Used for structural interface hierarchy, conversational prompt inputs, tooltips, and property inspection titles. Its geometric neutrality and precise letter spacing replicate high-performance developer tools.
- **JetBrains Mono (Metadata, Timelines, & Parameters):** Used for timecodes (`00:04:12:18`), frame rates, aspect ratios, model checkpoints, seed coordinates, and keybind badges. Monospaced tabular alignment guarantees layout stability when scrubbers and counters change continuously.
- **Micro-Scale Precision:** Interface labels operate tightly between 10px and 13px, utilizing slight letter tracking (`0.02em` to `0.04em`) to ensure instant legibility against charcoal backdrops.

## Layout & Spacing

The design system operates on an atomic 4px/8px coordinate rhythm tailored for high-density professional production suites.

### Layout Topology
- **Application Shell (Fixed/Docked Workspaces):** Uses a multi-pane split layout with variable vertical and horizontal panels: collapsible asset navigation (fixed 280px), flexible preview viewport (auto-stretch), property inspector (fixed 320px), and bottom-docked multi-track timeline (variable height, fixed min 240px).
- **Global Breakpoints:**
  - **Desktop Large (≥ 1440px):** Full 4-pane layout, persistent inspection tools, high-density timeline tracks.
  - **Desktop Standard (1024px – 1439px):** Collapsible side rails into flyout overlays; preview pane maintains native 16:9 frame scaling.
  - **Mobile / Tablet Compact (< 1023px):** Reflows to single-task focus: Viewport / Prompt Mode with timeline tucked behind an expandable bottom sheet. Gutter drops to `space-sm` (0.5rem) and page margin contracts to `space-md` (1rem).

## Elevation & Depth

Depth is established through translucent dark layering, razor-thin low-contrast outlines, and localized chromatic backdrops rather than muddy drop shadows.

### Elevation Architecture
- **Level 0 (Deep Ground - `#0B0C10`):** Base canvas and letterbox viewports. Completely flat, no reflection.
- **Level 1 (Docked Containers - `#12141A`):** 1px solid border (`#232733`). Separates editing regions cleanly without heavy shadows.
- **Level 2 (Interactive Floating Surfaces - `#181B22` / Glassmorphism):**
  - **Background:** `rgba(24, 27, 34, 0.72)`.
  - **Backdrop Blur:** `16px` with saturation boost (`140%`).
  - **Border:** 1px `rgba(255, 255, 255, 0.08)`.
  - **Shadow:** `0 8px 32px -4px rgba(0, 0, 0, 0.5)`.
  - Applied to timeline playhead chips, contextual tooltips, floating command bars, and prompt injection docks.
- **Level 3 (Modal Dialogs & AI Processing Overlays):**
  - **Background:** `rgba(18, 20, 26, 0.85)` with `24px` backdrop blur.
  - **Border:** 1px `rgba(99, 102, 241, 0.35)` with an interior directional inset glow: `inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
  - **Ambient Glow Shadow:** `0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 32px 0 rgba(99, 102, 241, 0.15)`.

## Shapes

The geometric rhythm is anchored by consistent 16px corner radii for primary surfaces, delivering an ergonomic, soft-modern silhouette that contrasts harmoniously with crisp video frames.

### Corner Radii Hierarchy
- **Canvas Panels, Modals, & Cards (`rounded-lg` / 16px):** Primary content modules, prompt bar dock containers, preview shells, and video thumbnail tiles.
- **Inputs, Buttons, & Floating Mini-bars (`rounded` / 8px):** Internal interactive components, drop-down select triggers, keyframe containers, and audio track strips.
- **Badges, Tags, & Status Pills (`rounded-xl` / 24px):** Operational tags, model version chips (e.g., `v2.4-Turbo`), rendering pills, and user avatar wrappers.

## Components

### Buttons
- **Primary AI Action:** Bound by an interactive gradient (`#6366F1` to `#8B5CF6`), text in `#F8FAFC`, 8px radius, subtle top-edge highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.25)`). Hover state unleashes a soft exterior glow (`0 0 20px rgba(99, 102, 241, 0.4)`).
- **Secondary / Ghost:** `#181B22` background with a 1px `#232733` border. Hover transitions border color to `#6366F1` and shifts surface brightness by 5%.
- **Icon / Scrubber Action:** 32x32px square container, `rounded-md` (6px), transparent background, `#94A3B8` icon stroke; active click state triggers `#6366F1` tint with scale compression (`transform: scale(0.96)`).

### Input Fields & Prompt Consoles
- **Generative Prompt Dock:** Frosted glass capsule (`rgba(24, 27, 34, 0.8)`), 16px border-radius, bounded by a 1px border (`#232733`). On focus, the border transitions to a glowing gradient ring (`#6366F1` to `#06B6D4`) with `box-shadow: 0 0 0 1px #6366F1, 0 8px 24px -4px rgba(99, 102, 241, 0.2)`.
- **Property Field (Inspector):** Compact 28px height, `#0B0C10` background, `#232733` border, typography rendered in `JetBrains Mono` at 12px for rapid numerical adjustment.

### Cards & Media Tiles
- Video asset items feature a 16px border radius, nested inside a 1px `#232733` enclosure with an aspect ratio lock (16:9 or 9:16).
- Hover state initiates a frame preview scrub with an active sub-pixel border glow in `#6366F1` and a glassmorphic duration tag (`rgba(11, 12, 16, 0.75)`) pinned to the bottom right.

### Chips & Badges
- Timecode and metadata chips utilize `JetBrains Mono` (11px), set inside `rgba(35, 39, 51, 0.6)` with an 8px radius and a 1px border in `#232733`.
- Active generation status chips incorporate a live pulsating dot in electric cyan (`#06B6D4`) with a soft atmospheric diffusion bloom.

### Checkboxes, Radios, & Switches
- **Switches:** Pill track (36px x 20px) in `#181B22` with a `#232733` border. Active state slides the thumb and illuminates the track in `#6366F1`.
- **Checkboxes:** 16x16px boxes with 4px roundedness. Inactive: `#12141A` fill, `#232733` outline. Checked: `#6366F1` fill with an off-white `#F8FAFC` checkmark.

### Domain-Specific Components
- **Multi-Track Timeline:** Alternating canvas rows (`#12141A` and `#0E1015`) divided by hairline boundaries (`#181B22`). Video clips display muted thumbnail waveforms; audio layers render high-contrast cyan audio spikes (`#06B6D4`).
- **Playhead Needle:** 1px hairline in `#06B6D4`, extending across the entire vertical track stack, capped with a luminous inverted-polygon glass badge indicating the current frame index.