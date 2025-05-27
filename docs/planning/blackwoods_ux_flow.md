# BlackWoods Creative - Single Page UX Flow

## 🎬 Page Structure & Flow

### **1. Hero Section** (Viewport 1)
```
┌─────────────────────────────────────┐
│  [Fixed Header with Logo]           │
│                                     │
│      BLACKWOODS CREATIVE            │
│                                     │
│    [ Cinematic Video Background ]   │
│                                     │
│      "Crafting Visual Stories"      │
│                                     │
│    [Scroll indicator animation]     │
└─────────────────────────────────────┘
```

**Elements:**
- Full-screen video background (showreel highlights)
- Logo animation on load (subtle expansion/glow)
- Minimal text overlay with your tagline
- Smooth scroll indicator (animated down arrow)
- Fixed navigation that appears/disappears on scroll

---

### **2. Work Categories** (Viewport 2)
```
┌─────────────────────────────────────┐
│           OUR EXPERTISE             │
│                                     │
│  [FILM] [PHOTO] [3D] [SCENES]      │
│                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐     │
│  │Preview│ │Preview│ │Preview│     │
│  │ Grid  │ │ Grid  │ │ Grid  │     │
│  └───────┘ └───────┘ └───────┘     │
└─────────────────────────────────────┘
```

**Interaction:**
- Tabs filter the portfolio grid below
- Smooth transitions between categories
- Hover effects on category tabs
- Active tab highlighted with gold accent

---

### **3. Portfolio Grid** (Viewport 3-4)
```
┌─────────────────────────────────────┐
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ Prj │ │ Prj │ │ Prj │ │ Prj │   │
│  │  1  │ │  2  │ │  3  │ │  4  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ Prj │ │ Prj │ │ Prj │ │ Prj │   │
│  │  5  │ │  6  │ │  7  │ │  8  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
└─────────────────────────────────────┘
```

**Features:**
- Masonry/grid layout with varying sizes
- Video thumbnails with play-on-hover
- Project titles overlay on hover
- Click to expand into lightbox/modal
- Parallax effect as you scroll through

---

### **4. About Section** (Viewport 5)
```
┌─────────────────────────────────────┐
│   WHO WE ARE                        │
│                                     │
│  ┌────────────┐  ┌─────────────────┐│
│  │   Team     │  │                 ││
│  │   Photo    │  │  Our story,     ││
│  │   Grid     │  │  expertise,     ││
│  │            │  │  approach       ││
│  └────────────┘  └─────────────────┘│
└─────────────────────────────────────┘
```

**Content:**
- Brief company story and mission
- Team photos/bios (optional)
- Key statistics or achievements
- Equipment/capabilities overview

---

### **5. Contact Section** (Viewport 6)
```
┌─────────────────────────────────────┐
│          GET IN TOUCH               │
│                                     │
│  ┌─────────────────┐ ┌─────────────┐│
│  │   Contact Form  │ │   Contact   ││
│  │                 │ │    Info     ││
│  │ [Name]          │ │             ││
│  │ [Email]         │ │ 📧 Email    ││
│  │ [Project Type]  │ │ 📱 Phone    ││
│  │ [Message]       │ │ 📍 Location ││
│  │                 │ │             ││
│  │ [Send Message]  │ │             ││
│  └─────────────────┘ └─────────────┘│
└─────────────────────────────────────┘
```

**Form Features:**
- Project type dropdown (Film, Photo, 3D, Other)
- Budget range selector (optional)
- File upload for references
- Thank you animation on submit

---

## 🎨 Animation & Parallax Strategy

### **Scroll-Triggered Animations**
```css
/* Section reveals */
.section-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.section-reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

### **Parallax Layers**
1. **Background videos** - Slow scroll (0.5x speed)
2. **Content sections** - Normal scroll (1x speed)  
3. **Floating elements** - Fast scroll (1.2x speed)
4. **Text overlays** - Varied speeds for depth

### **Micro-Interactions**
- Portfolio cards lift and glow on hover
- Category tabs slide active indicator
- Form inputs focus with golden glow
- Logo subtle pulse/breathing animation
- Scroll progress indicator in header

---

## 📱 Responsive Behavior

### **Desktop (1200px+)**
- Full parallax effects
- Multi-column portfolio grid
- Side-by-side contact layout
- Video backgrounds at full quality

### **Tablet (768px - 1199px)**
- Reduced parallax (performance)
- 2-3 column portfolio grid
- Stacked contact sections
- Optimized video quality

### **Mobile (< 768px)**
- Minimal parallax (battery friendly)
- Single column portfolio
- Simplified hero section
- Touch-optimized interactions

---

## 🎯 Navigation Strategy

### **Fixed Header**
```
┌─────────────────────────────────────┐
│ [LOGO]              [Work][About][Contact] │
└─────────────────────────────────────┘
```

**Behavior:**
- Transparent on hero section
- Solid background when scrolled
- Smooth scroll to sections on click
- Minimal, doesn't compete with content

### **Mobile Navigation**
- Hamburger menu with slide-out drawer
- Same smooth scroll behavior
- Touch-friendly tap targets

---

## 🎬 Loading & Transitions

### **Initial Load**
1. Logo fades in with subtle scale
2. Hero video fades in behind
3. Text overlay slides up
4. Scroll indicator appears last

### **Section Transitions**
- Staggered reveals for portfolio items
- Text content slides up slightly
- Images/videos fade in
- Subtle scale effects on interactive elements

### **Performance Considerations**
- Lazy load portfolio images/videos
- Preload hero video
- Progressive image enhancement
- Optimized animations for 60fps

---

## 💡 Conversion Strategy

### **Clear Value Proposition**
- Hero tagline immediately communicates what you do
- Portfolio speaks for itself
- Contact form is prominent but not pushy

### **Trust Signals**
- High-quality work showcased prominently
- Professional presentation throughout
- Easy way to get in touch
- Optional testimonials in about section

### **Call-to-Action Flow**
1. **Hero**: "See our work" (scroll encouragement)
2. **Portfolio**: "View project details" (engagement)
3. **About**: "Learn more about us" (trust building)
4. **Contact**: "Start your project" (conversion)

This structure keeps users engaged through visual storytelling while maintaining a clear path to contact you.