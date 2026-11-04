# Design System - سامانه مدیریت ناوگان آتی‌فرزام

## Overview
Comprehensive design system for the AtiFarzam Fleet Management presentation website, including colors, typography, components, and interaction patterns.

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Navy | `#102333` | Primary brand color, dark backgrounds, text on light backgrounds |
| Orange | `#f05327` | Accent color, CTAs, highlights, important elements |
| Cream | `#F2F4F8` | Light text on dark backgrounds, cards |

### Background Colors
| Name | Hex | Usage |
|------|-----|-------|
| Page Background | `#DCE1E8` | Overall page background (light gray) |
| Card Background | `rgba(255, 255, 255, 0.34)` | Light cards with glass effect |
| Dark Card | `rgba(16, 35, 51, 0.34)` | Dark navy cards |

### Neutral Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Surface Light | `--surface-light` | `rgba(255, 255, 255, 0.42)` | Light surfaces |
| Navy 92% | `--navy-92` | `rgba(16, 35, 51, 0.92)` | High opacity navy |
| Navy 80% | `--navy-80` | `rgba(16, 35, 51, 0.8)` | Medium-high opacity |
| Navy 60% | `--navy-60` | `rgba(16, 35, 51, 0.62)` | Medium opacity |
| Navy 20% | `--navy-20` | `rgba(16, 35, 51, 0.18)` | Low opacity |
| Navy 14% | `--navy-14` | `rgba(16, 35, 51, 0.14)` | Very low opacity |
| Navy 12% | `--navy-12` | `rgba(16, 35, 51, 0.11)` | Border colors |
| Navy 06% | `--navy-06` | `rgba(255, 255, 255, 0.52)` | Light text on dark |
| Navy 03% | `--navy-03` | `rgba(255, 255, 255, 0.34)` | Subtle light text |

### Orange Tints
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Orange 15% | `--orange-15` | `rgba(240, 83, 39, 0.14)` | Orange backgrounds |
| Orange 35% | `--orange-35` | `rgba(240, 83, 39, 0.34)` | Orange borders |

## Typography

### Font Family
- **Primary:** Peyda (پیدا)
  - Regular (400)
  - SemiBold (600)
  - ExtraBold (800)
- **Fallback:** Tahoma, system-ui, -apple-system, sans-serif

### Font Weights
| Weight | Usage |
|--------|-------|
| 400 (Regular) | Body text, normal content |
| 600 (SemiBold) | Subheadings, emphasis |
| 700 (Bold) | Strong emphasis |
| 800 (ExtraBold) | Headings, titles |

### Font Sizes
| Element | Size | Line Height |
|---------|------|-------------|
| H1 | `clamp(2.1rem, 6vw, 2.8rem)` | 1.4 |
| H2 | `1.48rem` | 1.5 |
| H3 | `1.12rem - 1.24rem` | 1.6 |
| Body | `1rem` | 1.8 |
| Small | `0.76rem - 0.94rem` | 1.5 |
| Metrics | `0.9rem - 1.18rem` | Custom |

### Text Colors
| Context | Color | Variable |
|---------|-------|----------|
| Dark text on light | `#102333` | `--navy` |
| Light text on dark | `#F2F4F8` | `--cream` |
| Orange accent text | `#f05327` | `--orange` |
| Subtle text | `rgba(16, 35, 51, 0.8)` | `--navy-80` |
| Muted text | `rgba(16, 35, 51, 0.62)` | `--navy-60` |

## Background Gradient

### Top-to-Bottom Navy Gradient
```css
background: linear-gradient(
  180deg,
  rgba(16, 35, 51, 0.4) 0%,
  rgba(16, 35, 51, 0.29) 18%,
  rgba(16, 35, 51, 0.17) 38%,
  rgba(16, 35, 51, 0.065) 62%,
  rgba(16, 35, 51, 0) 88%
);
```

**Purpose:** Soft atmospheric gradient behind all components, starting at 40% opacity from the top.

## Glass Effects

### Frosted Glass Card
```css
background: rgba(255, 255, 255, 0.3);
backdrop-filter: blur(18px) saturate(180%);
-webkit-backdrop-filter: blur(18px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.76);
```

**Usage:** Top navigation bar, floating cards

### Dark Glass Card
```css
background: var(--navy-03);
border: 1.5px solid var(--navy-12);
```

**Usage:** Capability cards, benefit cards, hardware cards, software cards

### Orange Glass Rail
```css
background: rgba(240, 83, 39, 0.24);
backdrop-filter: blur(10px) saturate(165%);
```

**Usage:** Scroll rail track

### Smoked Gray Glass Circle
```css
background: rgba(118, 130, 146, 0.2);
backdrop-filter: blur(1.8px) saturate(135%);
border: none;
```

**Usage:** Scroll trace traveler

## Components

### Buttons

#### Primary Orange Button
```css
background: var(--orange);
color: #fff;
border: none;
border-radius: var(--radius-pill);
padding: 12px 28px;
font-weight: 700;
transition: all 0.35s ease;

&:hover {
  background: #e04822;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(240, 83, 39, 0.3);
}
```

#### Outline Cream Button
```css
background: transparent;
color: var(--cream);
border: 1.5px solid rgba(255, 255, 255, 0.84);
border-radius: var(--radius-pill);
padding: 12px 28px;
font-weight: 600;

&:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--cream);
}
```

### Cards

#### Silk Card (Hover Effect)
```css
border-radius: var(--radius-lg);
border: 1.5px solid var(--navy-12);
background: var(--navy-03);
padding: 28px 30px;
transition: all 0.35s ease;

&:hover {
  border-color: var(--orange);
  background: var(--navy-06);
  box-shadow: 0 18px 40px rgba(16, 35, 51, 0.08);
}

&::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--gx, var(--gy)),
    rgba(255, 255, 255, 0.12) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.45s var(--ease-silk);
}

&:hover::before {
  opacity: 1;
}
```

### Navigation

#### Top Bar
```css
position: fixed;
top: 14px;
left: 0;
right: 0;
z-index: 90;
pointer-events: none;

.top-bar-inner {
  pointer-events: auto;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.76);
  box-shadow: 0 6px 20px rgba(16, 35, 51, 0.06);
}
```

#### Navigation Links
```css
display: flex;
align-items: center;
gap: 6px;

.top-nav a {
  color: var(--navy);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 11px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.35s ease;
}

.top-nav a:hover {
  background: var(--orange-15);
  border-color: var(--orange-35);
  color: var(--orange);
}
```

### Scroll Rail

#### Rail Container
```css
position: fixed;
left: 14px;
top: 50%;
transform: translateY(-50%);
width: 44px;
height: min(48vh, 280px);
z-index: 80;
pointer-events: none;
```

#### Rail Track
```css
position: absolute;
left: 0;
right: 0;
bottom: 0;
height: 100%;
width: 4px;
border-radius: var(--radius-pill);
background: rgba(240, 83, 39, 0.24);
backdrop-filter: blur(10px) saturate(165%);
```

#### Rail Fill
```css
position: absolute;
left: 0;
width: 100%;
height: 0%;
border-radius: var(--radius-pill);
background: linear-gradient(
  180deg,
  rgba(240, 83, 39, 0.46) 0%,
  rgba(240, 83, 39, 0.74) 100%
);
box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.46);
```

#### Traveler Circle
```css
position: absolute;
left: 50%;
top: 0%;
width: 44px;
height: 44px;
transform: translate(-50%, -50%);
border-radius: 50%;
border: none;
background: rgba(118, 130, 146, 0.2);
backdrop-filter: blur(1.8px) saturate(135%);
box-shadow: 0 4px 14px rgba(16, 35, 51, 0.1);
```

## Spacing

### Spacing Scale
| Name | Value | Usage |
|------|-------|-------|
| xs | `4px` | Tiny spacing |
| sm | `8px` | Small spacing |
| md | `12px - 16px` | Medium spacing |
| lg | `20px - 24px` | Large spacing |
| xl | `28px - 32px` | Extra large spacing |
| 2xl | `40px - 44px` | 2x large spacing |

### Container Width
```css
width: min(1120px, calc(100% - 128px));
```

## Border Radius

| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| Extra Large | `--radius-xl` | `34px` | Large cards, containers |
| Large | `--radius-lg` | `24px` | Cards, modals |
| Medium | `--radius-md` | `16px` | Buttons, inputs |
| Pill | `--radius-pill` | `999px` | Pills, badges, buttons |

## Shadows

### Card Shadow
```css
box-shadow: 0 18px 40px rgba(16, 35, 51, 0.08);
```

### Top Bar Shadow
```css
box-shadow:
  0 6px 20px rgba(16, 35, 51, 0.06),
  inset 0 1px 0 rgba(255, 255, 255, 0.95),
  inset 0 -1px 0 rgba(16, 35, 51, 0.06);
```

### Button Shadow
```css
box-shadow: 0 8px 20px rgba(240, 83, 39, 0.3);
```

### Traveler Shadow
```css
box-shadow: 0 4px 14px rgba(16, 35, 51, 0.1);
```

## Animations & Transitions

### Easing Functions
```css
--ease-silk: cubic-bezier(0.22, 1, 0.36, 1);
```

**Usage:** Smooth, natural motion for all animations

### Transition Durations
| Element | Duration | Property |
|---------|----------|----------|
| Buttons | `0.35s` | All properties |
| Cards | `0.35s - 0.45s` | Border, background, shadow |
| Text | `0.3s` | Color |
| Glass effects | `0.45s` | Opacity, backdrop-filter |
| Scroll | `0.55s` | Transform, top |

### Loading Motions
Only three motion types are used in the presentation:

1. **#08 - Diagonal Orbit (رقص قطری)**
   - Used in: Closing section
   - Characteristics: Diagonal circular motion

2. **#10 - Klein Flip (ورق‌خوردن چهارگانه)**
   - Used in: Benefits section
   - Characteristics: Quadruple page flip animation

3. **#12 - Droplet Wave (موج قطره‌ای خطی)**
   - Used in: Benefits section
   - Characteristics: Linear droplet wave

### Contour Trace
**Title:** ترسیم خطی

**Description:** Scroll-driven animation that draws a line from top to bottom

**Implementation:**
- SVG path with stroke-dashoffset animation
- Four paths rotated at 0°, 90°, 180°, 270°
- Smooth progression based on scroll position
- Fill and stroke opacity animations

## Responsive Design

### Breakpoints
| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Desktop | > 1024px | Full layout |
| Tablet | 860px - 1024px | Adjusted grid layouts |
| Mobile Large | 680px - 860px | Simplified navigation, stacked layouts |
| Mobile Small | < 680px | Single column, mobile-optimized |

### Mobile Adjustments
- Navigation hides on small screens
- Scroll rail becomes smaller (32px)
- Cards stack vertically
- Hero layout becomes single column
- Font sizes scale down
- Touch-optimized targets (min 44x44px)

## Accessibility

### Color Contrast
- All text meets WCAG AA contrast requirements
- Dark text on light: Minimum 4.5:1 ratio
- Light text on dark: Minimum 4.5:1 ratio

### Keyboard Navigation
- All interactive elements keyboard-accessible
- Logical tab order
- Visible focus indicators

### Screen Readers
- Semantic HTML structure
- ARIA labels for interactive elements
- Alt text for images
- Hidden content for screen readers where needed

### Motion
- Reduced motion support for users who prefer it
- Smooth animations that don't cause distraction

## Language Support

### Supported Languages
1. **Persian (FA)** - Default, RTL
2. **English (EN)** - LTR
3. **Arabic (AR)** - RTL

### Language Switcher
- Location: Top-left corner
- Type: Sliding drawer
- Features: No globe icon, pure text labels
- Persistence: Local storage

### i18n Implementation
- Data attributes: `data-i18n="key.path"`
- JavaScript dictionary: Separate objects for each language
- Automatic direction change: `dir="rtl"` / `dir="ltr"`
- Language-specific styling adjustments

## Best Practices

### Performance
- Lazy loading for off-screen content
- Optimized SVG animations
- Paused animations when not visible
- Efficient CSS with minimal repaints
- Zero idle requestAnimationFrame loops

### Maintainability
- CSS custom properties for colors
- Consistent naming conventions
- Modular component structure
- Clear separation of concerns

### User Experience
- Smooth, damped motion
- No jitter or shaking
- Consistent hover states
- Clear visual feedback
- Intuitive navigation

## Premium Command Layer (2026)

`src/premium.css` + `src/premium.js` load after the base layer and lift the site from
"soft glass presentation" to a **fleet command deck** identity. The base tokens stay
intact; the premium layer adds a darker stage and stronger contrast.

### New tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#071320` | Hero / page-plate / footer background |
| `--ink-2` | `#0a1a28` | Console and dark card surfaces |
| `--ink-line` | `rgba(255,255,255,.10)` | Hairlines on dark |
| `--orange-hot` | `#ff6a38` | Live accents, gradients, focus rings |
| `--mono` | system mono stack | Telemetry labels, chapter numbers, micro-copy |

### Hero (home)

- Full-viewport dark stage with a perspective grid, ambient orange/blue glows, scan-line and a `GPS` outline watermark.
- Split copy / console composition: oversized Persian headline with a gradient accent word, glass tag, two CTAs, and a 3-column proof strip along the bottom.
- **Live console** (`#hero-console`): window chrome, animated route, geofence, radar sweep, vehicle chips, telemetry side panel, floating alert cards and a moving route runner. The data drifts every 3.4s (paused when the tab is hidden / reduced motion).
- The console is `aria-hidden`; the hero copy remains the accessible content. A capability ticker closes the dark band.

### Sub-page plates

- Every `.page-hero` becomes a dark chapter plate with a perspective grid, ambient glow, rounded bottom corners and, on wide screens, a rotating `page-emblem` (big outlined chapter number + orbit rings) injected by `premium.js`.
- Software / company plates add primary/secondary CTAs; hardware keeps its 4 dark-glass pillar cards.

### Motion

- Entrance choreography on the hero copy and console; pointer parallax on the hero scene; 3D tilt on the console; magnetic primary buttons; staggered reveal in card grids; animated ticker; logo orbit.
- Everything respects `prefers-reduced-motion`.

### Light sections

- Warmer paper gradient with a fine grain overlay and the existing kinetic dot field.
- Crisper cards (`rcard`, `aud`, `cinfo`): higher white opacity, inner highlight, orange top hairline on hover, deeper shadows.
- Section rhythm opened up (`section-space` up to 118px), dark CTA/closing plates with grid + glow, deep footer with a ghost `ATIFARZAM` wordmark.

### i18n

Console and ticker labels use `data-i18n` keys (`console.*`, `tick.*`) added to
`SHARED_I18N_ADDITIONS` for FA / EN / AR.

