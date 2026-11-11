---
name: Warm Architectural Japandi
colors:
  surface: '#fdf9f3'
  surface-dim: '#ddd9d4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ed'
  surface-container: '#f1ede7'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e6e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#53433b'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0ea'
  outline: '#86736a'
  outline-variant: '#d9c2b7'
  surface-tint: '#904d21'
  primary: '#804116'
  on-primary: '#ffffff'
  primary-container: '#9e582c'
  on-primary-container: '#ffe7db'
  inverse-primary: '#ffb68d'
  secondary: '#615e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e4dfda'
  on-secondary-container: '#65625e'
  tertiary: '#704a22'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b6238'
  on-tertiary-container: '#ffe8d5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#72360b'
  secondary-fixed: '#e7e1dd'
  secondary-fixed-dim: '#cbc6c1'
  on-secondary-fixed: '#1d1b19'
  on-secondary-fixed-variant: '#494643'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#fdf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e6e2dc'
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 3.5rem
    fontWeight: '400'
    lineHeight: 4.25rem
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 2.5rem
    fontWeight: '500'
    lineHeight: 3rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: 2.5rem
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.875rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 5rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3.5rem
---

## Brand & Style

This design system embodies the Japandi philosophy—a serene synthesis of Scandinavian functionality and Japanese rustic minimalism. It is crafted for discerning homeowners, interior architects, and design enthusiasts who value craftsmanship, tactile materials, and spatial harmony.

The emotional signature is calming, curated, and grounded. The UI avoids visual clutter, relying instead on deliberate negative space, architectural proportion, and warm, organic undertones. Visual density remains low to medium, allowing high-resolution photography of furniture pieces to breathe as focal sculptures within the canvas.

## Colors

The palette draws inspiration from untreated timber, natural plaster, stone, and rich upholstery leathers.

- **Primary (`#9E582C`)**: A grounded terracotta/cognac tone dedicated to primary interaction triggers, active navigation highlights, and curated promotional flags.
- **Secondary (`#2A2825`)**: A warm deep charcoal/espresso utilized for high-contrast architectural typography and high-emphasis icons.
- **Tertiary (`#D4A373`)**: A soft raw-wood tint used for subtle badges, hover overlays, and secondary focal accents.
- **Neutral (`#F5F1EB`)**: An oat-plaster surface color establishing a warm, tactile backdrop instead of stark digital white.

Canvas backgrounds utilize `#FBF9F5` (Oat Wash), transitioning to `#F5F1EB` (Pressed Linen) for contained surfaces. Structural dividing strokes rely on `#E7E2DA` (Soft Stone) to demarcate zones without harsh visual breaks.

## Typography

The typographic hierarchy pairs the editorial grace of **Playfair Display** with the functional clarity of **Plus Jakarta Sans**.

- Editorial headlines and narrative sections leverage Playfair Display with loose leading to echo premium architectural journals.
- Product dimensions, specification sheets, filtering metadata, and e-commerce transactions adopt Plus Jakarta Sans to guarantee immediate legibility across compact viewports.
- All uppercase labels and categories feature subtle positive tracking (`0.04em` to `0.06em`) to maintain clarity and understated sophistication.

## Layout & Spacing

The layout model relies on a responsive 12-column fluid grid governed by generous outer framing and deliberate structural pacing.

- **Breakpoints**: Mobile (0–767px), Tablet (768–1199px), and Desktop (1200px+). Max container width is pegged at 1440px to preserve visual restraint on ultra-wide displays.
- **Rhythm**: Spacing units are multiples of 4px and 8px. Elements favor asymmetrical, gallery-style staggered layouts for editorial collections, paired with structured 3- or 4-column balanced grids for catalog browsing.
- **Margins & Gutters**: Outer margins expand progressively on larger screens (`1.25rem` mobile up to `5rem` desktop), framing the furniture showcases akin to modern showroom partitions.

## Elevation & Depth

In alignment with minimalist architecture, visual depth is expressed through tonal transitions and delicate ambient shadows rather than stark layered drop-shadows.

- **Surface Tonal Stacking**: The canvas (`#FBF9F5`) holds recessed elements, while interactive cards and drawers rest on natural plaster `#F5F1EB` or pure `#FFFFFF` panels.
- **Ghost Outlines**: Standard containers, inputs, and modular cards rely on a 1px solid `#E7E2DA` border.
- **Ambient Shadows**: Raised sheets and contextual cart panels utilize an ultra-diffused, warm-tinted shadow: `0 12px 36px -8px rgba(42, 40, 37, 0.06)`. Hover states on catalog items lift subtly with `0 6px 20px -4px rgba(42, 40, 37, 0.05)` accompanied by a gentle border tone shift to `#D4A373`.

## Shapes

The design system adopts a refined, tailored shape language (`roundedness: 1`). Corners are gently softened (0.25rem for standard UI, 0.5rem for larger surfaces) to temper the starkness of brutalist geometry while retaining sharp, architectural discipline.

Capsule pills are reserved exclusively for contextual tags, filter chips, and category toggles to differentiate interactive micro-elements from structural furniture cards.

## Components

### Buttons
- **Primary**: Filled terracotta (`#9E582C`) background with crisp off-white text (`#FBF9F5`), 0.25rem radius, padded with `0.875rem` vertical and `1.75rem` horizontal. On hover: shifts to rich espresso (`#2A2825`) with a 200ms ease transition.
- **Secondary / Ghost**: Transparent background framed with a 1px border of `#2A2825`, espresso text. On hover: fills with `#F5F1EB`.
- **Text Action**: Playfair Display or tracked Plus Jakarta Sans accompanied by a micro directional arrow (`→`), underlined with a 1px terracotta stroke offset by 4px.

### Product Showcase Cards
- Framed in 1px `#E7E2DA` border with background `#FFFFFF`. Aspect ratios for product imagery remain strict 4:5 or 1:1.
- Image containers feature a neutral warm-gray backdrop (`#F7F5F0`) to ensure silhouettes of natural wood, bouclé, and leather contrast organically without aggressive masking.
- Minimal default state: clean image, collection name, wood/fabric variant dots, and price in espresso. Hover reveals quick-view trigger and secondary angle.

### Chips & Filter Pills
- Filter pills use fully rounded edges (`border-radius: 9999px`), 1px `#E7E2DA` border, and `#FBF9F5` fill.
- Selected state shifts fill to `#2A2825` with ivory text, eliminating the border.

### Input Fields & Selectors
- Flat surfaces bounded by 1px `#E7E2DA` border, radius `0.25rem`, padded with `1rem`. Text input in `#2A2825`.
- Focus state drops standard blue glows in favor of a crisp 1px `#9E582C` border accompanied by an ambient warm shadow (`rgba(158, 88, 44, 0.1)`).

### Room Planner & Material Swatches
- Specialized components include circular material swatches (wood grains, textiles, leathers) wrapped in an active dual-ring indicator (outer stroke separated by 2px gap).
- Dimension indicator pills display concise architectural dimensions (`W × D × H cm`) in `label-sm` typography.