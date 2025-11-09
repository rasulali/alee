## Design System

**CRITICAL: Always follow the strict design system defined in `src/app/[locale]/globals.css`**

The project uses a minimal, constrained Tailwind setup. ONLY the following values are available:

### Colors

- `background` - Main background color
- `primary` - Primary text/foreground color
- `accent` - Accent color (red)
- `transparent`, `current`

**Usage:** `text-primary`, `bg-background`, `text-primary/40` (with opacity)

### Font Sizes

- `xs` (0.75rem), `sm` (0.875rem), `base` (1rem), `xl` (1.25rem), `3xl` (1.875rem)

**Usage:** `text-sm`, `text-3xl`

### Spacing

- `0`, `1` (0.25rem), `2` (0.5rem), `3` (0.75rem), `4` (1rem), `6` (1.5rem), `8` (2rem), `12` (3rem)

**Usage:** `p-2`, `gap-x-3`, `mb-2`, `w-12`

### Letter Spacing

- `wide` (0.025em), `wider` (0.05em)

**Usage:** `tracking-wide`

### Line Height

- `none` (1), `tight` (1.25), `normal` (1.5), `relaxed` (1.75)

**Usage:** `leading-none`

### Border Radius

- `none`, `sm`, default, `md`, `lg`, `full`

**DO NOT use any Tailwind values outside this system.** If you need a value not listed, ask first or add it to the `@theme` section in globals.css.

## Design Inspiration & Reference

- <https://ustinov.design>
- <https://collserola.com>
- <https://www.carlhauser.com>

## UI/UX Ideas

- **Terminal-Style Loading Animation:** Implement loading states using terminal interface aesthetic with animated dots from cli-spinners package. Creates developer-friendly, retro loading experience that aligns with technical portfolio branding.
- **Generative Art Canvas:** Implement procedural art generation using canvas API with p5.js-like polyfill for visual interest sections. Create grid-based compositions with randomized geometric shapes (arcs, circles) forming recognizable patterns (birds, flowers, grass). Click-to-regenerate interaction encourages exploration. Lightweight approach avoids external dependencies while adding dynamic visual elements. Use retina-aware scaling for crisp rendering across devices.
