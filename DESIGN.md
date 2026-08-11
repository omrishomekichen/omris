---
name: Artisanal Harvest
colors:
  surface: '#fff8f3'
  surface-dim: '#e0d9d3'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ec'
  surface-container: '#f4ede6'
  surface-container-high: '#eee7e1'
  surface-container-highest: '#e8e1db'
  on-surface: '#1e1b17'
  on-surface-variant: '#59413c'
  inverse-surface: '#33302c'
  inverse-on-surface: '#f7efe9'
  outline: '#8d706b'
  outline-variant: '#e1bfb8'
  surface-tint: '#af2f1b'
  primary: '#650700'
  on-primary: '#ffffff'
  primary-container: '#8c1404'
  on-primary-container: '#ff9885'
  inverse-primary: '#ffb4a6'
  secondary: '#785a00'
  on-secondary: '#ffffff'
  secondary-container: '#fed16e'
  on-secondary-container: '#775800'
  tertiary: '#00257f'
  on-tertiary: '#ffffff'
  tertiary-container: '#0038b2'
  on-tertiary-container: '#9db0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a6'
  on-primary-fixed: '#3f0300'
  on-primary-fixed-variant: '#8d1505'
  secondary-fixed: '#ffdf9d'
  secondary-fixed-dim: '#ecc15f'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b7c4ff'
  on-tertiary-fixed: '#001551'
  on-tertiary-fixed-variant: '#0339b3'
  background: '#fff8f3'
  on-background: '#1e1b17'
  surface-variant: '#e8e1db'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The brand personality for this design system is **Premium, Artisanal, and Grounded**. It captures the essence of home-made quality through a sophisticated, modern lens. The target audience includes culinary enthusiasts and quality-conscious consumers who value tradition but appreciate a clean, professional digital experience.

The design style is **Minimalist with Tactile accents**. It leverages heavy whitespace and a warm, organic color palette to create an appetizing and inviting environment. By combining high-end editorial typography with soft, subtle depth, the UI evokes a sense of "modern heritage"—bridging the gap between the rustic kitchen and the premium storefront.

## Colors

The palette is derived directly from the rich, natural tones of the product.

- **Primary (Deep Red):** A bold, savory red used for calls-to-action, price highlights, and brand-critical elements.
- **Secondary (Warm Gold):** A sophisticated metallic accent used for decorative flourishes, secondary buttons, and premium labels.
- **Background (Light Cream):** The foundation of the design, providing a warm, non-clinical environment that enhances food photography.
- **Surface (White):** Used for cards and input containers to provide a clean contrast against the cream background.
- **Text (Deep Charcoal):** A soft black used for primary body text and headings to ensure high legibility without the harshness of pure black.

## Typography

The typography strategy uses a "High-Low" pairing. **Libre Caslon Text** provides an authoritative, literary feel for headlines, emphasizing the brand's artisanal roots. **Work Sans** is used for all functional UI and body copy, offering a clean, neutral, and highly legible counterpoint that ensures the admin dashboard remains efficient and the shop remains easy to navigate.

Use `display-lg` for hero sections, and `label-caps` for small metadata like product categories or "In Stock" indicators.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with fixed maximum containers for desktop (1280px). 

- **Grid Model:** A 12-column grid for desktop, 6-column for tablet, and 2-column for mobile.
- **Rhythm:** An 8px base unit drives all padding and margin decisions. 
- **White Space:** Generous vertical spacing (`xl`) is used between sections in the consumer storefront to maintain a "premium editorial" feel. In the admin dashboard, spacing should be tightened to `md` for higher data density.
- **Reflow:** On mobile, side margins shrink to 16px to maximize screen real estate for product imagery.

## Elevation & Depth

Visual hierarchy is achieved through **Ambient Shadows** and **Tonal Layering**.

- **Shadows:** Use extremely soft, diffused shadows with a slight warm tint (`rgba(45, 42, 38, 0.05)`) to lift cards and buttons off the cream background. Shadows should feel like natural sunlight, not digital dropshadows.
- **Depth Levels:**
    - **Level 0 (Flat):** Main background.
    - **Level 1 (Raised):** Cards, input fields, and secondary buttons. Use a 4px blur.
    - **Level 2 (Floating):** Primary CTAs, dropdown menus, and hover states. Use a 12px blur.
- **Outlines:** Use low-contrast 1px borders in a darker shade of the background color (#E5DED5) to define areas without adding visual weight.

## Shapes

The shape language is **Rounded**, reflecting the organic nature of glass jars and fresh ingredients. 

- **Standard Radius:** 0.5rem (8px) for buttons, inputs, and small cards.
- **Large Radius:** 1rem (16px) for major containers, product images, and modal windows.
- **Interactive Elements:** Buttons should always maintain a consistent radius. Avoid pill-shapes to keep the aesthetic professional rather than "bubbly."

## Components

- **Buttons:** 
    - **Primary:** Deep Red background, white text. No border.
    - **Secondary:** Warm Gold background or outline.
    - **Ghost:** Deep Charcoal text, no background, subtle underline on hover.
- **Input Fields:** White surface, 1px border (#E5DED5), Work Sans typography. Focus state uses a 1px Gold border.
- **Product Cards:** White background, 16px border radius, subtle Level 1 shadow. Image should have a slight zoom effect on hover.
- **Chips/Badges:** Use the `label-caps` style. "Hot" or "Best Seller" tags should use a Secondary Gold background with Deep Charcoal text.
- **Lists (Admin):** High density, using `body-sm`. Alternate row colors with a very faint cream tint for readability.
- **Iconography:** Use thin-stroke (2pt) line icons with rounded terminals to match the typography's artisanal feel.