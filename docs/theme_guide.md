# Theme Guide: BlackWoods Creative
## Concept: "Deep Forest Haze"

### 1. Core Philosophy

The "Deep Forest Haze" theme is designed to be **atmospheric, immersive, and premium**. The core goal is to make visitors feel like they are stepping into a mysterious, creative space, not just Browse a website. The aesthetic is inspired by the feeling of light filtering through a dense, misty forest at twilight.

**Keywords:** Mysterious, Organic, Sophisticated, Cinematic, Calm, Immersive.

Every design decision should serve this core philosophy. We are choosing atmosphere over starkness, subtlety over loudness, and organic textures over flat colors.

---

### 2. Color Palette

Colors are named semantically for their intended use. Use these variables to ensure consistency.

| Role                  | Variable Name       | Hex Code      | Description                                                               |
| --------------------- | ------------------- | ------------- | ------------------------------------------------------------------------- |
| **Primary Background** | `$bg-primary`       | `#101211`     | Near Black. A deep, slightly green-tinted charcoal. More organic than pure black. |
| **Primary Text** | `$text-primary`     | `#E8E8E3`     | Off-White. A soft, warm white that's easy on the eyes.                      |
| **Accent / CTA** | `$accent-gold`      | `#C3A358`     | Muted Gold. A rich, warm ochre. Used for buttons, headlines, and links.    |
| **Aurora Color 1** | `$aurora-teal`      | `#0D2E2B`     | Dark Teal. The cool, deep base of the background gradient.                  |
| **Aurora Color 2** | `$aurora-green`     | `#1A4230`     | Forest Green. The rich, organic tone that blends with the teal.           |
| **Subtle Border** | `$border-subtle`    | `#2A2E2C`     | A low-contrast grey for subtle dividers or card borders if needed.         |


---

### 3. Typography

The typography pairs a classic, elegant serif for headlines with a clean, modern sans-serif for body text. This creates a balance between artistry and readability.

**Font Families:**
* **Primary (Headings):** `Playfair Display` or `Lora` (Google Fonts). Evokes elegance and quality.
* **Secondary (Body & UI):** `Inter` or `Source Sans Pro` (Google Fonts). Clean, legible, and neutral.

**Type Scale:**
* **h1 (Main Headline):**
    * Font: `Playfair Display`
    * Size: `4rem` (64px)
    * Weight: `600` (Semi-bold)
    * Letter-spacing: `-0.02em`
    * Color: `$accent-gold`

* **h2 (Section Headings):**
    * Font: `Playfair Display`
    * Size: `2.5rem` (40px)
    * Weight: `600`
    * Letter-spacing: `-0.01em`
    * Color: `$text-primary`

* **h3 (Card Titles, Sub-headings):**
    * Font: `Inter`
    * Size: `1.5rem` (24px)
    * Weight: `600`
    * Color: `$text-primary`

* **p (Body Text):**
    * Font: `Inter`
    * Size: `1rem` (16px)
    * Weight: `400` (Regular)
    * Line-height: `1.6`
    * Color: `$text-primary` (with opacity `85%` for a softer feel)

* **small (Captions, Meta info):**
    * Font: `Inter`
    * Size: `0.875rem` (14px)
    * Weight: `400`
    * Color: `$text-primary` (with opacity `60%`)

---

### 4. Layout & Spacing

We use a consistent spacing scale based on an **8px grid** to maintain rhythm and harmony.

* `$space-xs`: 4px
* `$space-sm`: 8px
* `$space-md`: 16px
* `$space-lg`: 32px
* `$space-xl`: 64px
* `$space-xxl`: 128px

**Guidelines:**
* **Grid:** Use a 12-column grid for main page layouts, but don't be afraid to break it for artistic effect (e.g., overlapping elements).
* **Whitespace:** Be generous. Ample whitespace is premium. Use `$space-xxl` between major page sections.
* **Asymmetry:** Intentionally use asymmetrical layouts for sections like "Our Story" (e.g., 4 columns of text next to a 7-column image) to create visual interest.

---

### 5. Core Components

**Buttons:**
* **Primary CTA (`.btn-primary`):**
    * Background: `$accent-gold`
    * Text Color: `$bg-primary`
    * Padding: `$space-md $space-lg`
    * Border-radius: `8px`
    * Font: `Inter`, Weight `600`
    * **Hover:** Background brightens by 10%, subtle lift (`transform: translateY(-3px)`).
    * **Transition:** `all 0.3s ease-out`

* **Secondary CTA (`.btn-secondary`):**
    * Background: `transparent`
    * Text Color: `$accent-gold`
    * Border: `2px solid $accent-gold`
    * Padding: `$space-md $space-lg`
    * Border-radius: `8px`
    * **Hover:** Background fills with `$accent-gold`, text becomes `$bg-primary`.
    * **Transition:** `all 0.3s ease-out`

**Cards (for Services):**
* Background: A semi-transparent black (`rgba(16, 18, 17, 0.5)`) with a frosted glass effect (`backdrop-filter: blur(12px)`).
* Border: `1px solid $border-subtle`
* Border-radius: `16px`
* Padding: `$space-lg`
* **Hover:** Border color animates to `$accent-gold`, subtle lift.

---

### 6. The "Magic": Atmosphere & Animation

This is what elevates the theme. Animation should always be subtle and smooth.

**A. The Aurora Background:**
This is the core atmospheric element. It should be a slow, looping animation.
* **Technique:** Use a `::before` or `::after` pseudo-element on the body, positioned absolutely behind all content.
* **Effect:** Create multiple large, radial gradients with the `$aurora-teal` and `$aurora-green` colors. Position them off-screen.
* **Animation:** Create a CSS animation (`@keyframes`) that slowly moves these gradient "clouds" across the screen over a long duration (e.g., 60 seconds). Use `transform: translate()` and `rotate()` to make the movement feel organic. Apply a `blur()` filter to keep the edges extremely soft.

*Conceptual CSS:*
```css
body::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 20% 30%, #0D2E2B 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, #1A4230 0%, transparent 35%);
  filter: blur(100px);
  animation: slowDrift 60s alternate infinite linear;
  z-index: -1;
}

@keyframes slowDrift {
  from { transform: rotate(0deg) translateX(0px); }
  to { transform: rotate(20deg) translateX(50px); }
}


B. Drifting Particles:

    Technique: Use JavaScript or multiple CSS animations to create a small number of div elements positioned absolutely.
    Style: Small 2px x 2px divs, border-radius: 50%, background-color: $accent-gold, with varying opacities.
    Animation: Animate them on looping, slightly different paths with different delays and durations to create a natural, random drifting effect.

C. Scroll Animations:

    Use the Intersection Observer API to detect when an element enters the viewport.
    Apply a "fade in and slide up" effect to sections or cards as they appear. The effect should be subtle.
    Default State: opacity: 0; transform: translateY(20px);
    Visible State: opacity: 1; transform: translateY(0);
    Transition: opacity 0.8s ease-out, transform 0.6s ease-out

7. Imagery & Iconography

    Icons: Icons should be clean, single-weight line icons. Their color should be $accent-gold.
    Photography/Video: All visual assets must match the theme's mood. They should be cinematic, moody, with deep shadows and soft, diffused highlights. Avoid bright, over-exposed, or corporate-looking stock photos.