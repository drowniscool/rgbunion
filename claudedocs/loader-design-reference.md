# PageLoader Design Reference

## Visual Design Breakdown

### Overall Structure
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Fullscreen Overlay                   │
│           Background: slate-900/95 + backdrop-blur      │
│                                                         │
│                  ┌───────────────┐                      │
│                  │               │                      │
│               ┌──┴───────────────┴──┐                   │
│               │   Rotating Hexagon  │                   │
│               │   (8s clockwise)    │                   │
│               │  ┌───────────────┐  │                   │
│               │  │  Diamond      │  │                   │
│               │  │  (6s counter) │  │                   │
│               │  │  ┌─────────┐  │  │                   │
│               │  │  │ Circle  │  │  │                   │
│               │  │  │ Pulse   │  │  │                   │
│               │  │  └─────────┘  │  │                   │
│               │  └───────────────┘  │                   │
│               └─────────────────────┘                   │
│                  Orbital Particles                      │
│                                                         │
│                      "Loading"                          │
│                  (Gold shimmer text)                    │
│                                                         │
│                  [Optional message]                     │
│                                                         │
│                    ● ● ●                                │
│                 (Bouncing dots)                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Animation Layers (Front to Back)

### Layer 1: Background
- **Color**: `bg-slate-900/95`
- **Effect**: `backdrop-blur-md`
- **Transition**: Fade in/out (300ms)
- **Z-index**: 9999

### Layer 2: Outer Hexagon
- **Shape**: 6-sided polygon
- **Size**: 128px × 128px
- **Rotation**: 8s clockwise
- **Stroke**: Gold gradient (#BF953F → #FCF6BA → #B38728)
- **Animation**: `animate-spin-slow` + `animate-pulse-opacity`

### Layer 3: Middle Diamond
- **Shape**: 4-sided polygon (rotated square)
- **Size**: 80px × 80px
- **Rotation**: 6s counter-clockwise
- **Stroke**: Reverse gold gradient (#B38728 → #FCF6BA → #BF953F)
- **Animation**: `animate-spin-reverse` + delayed pulse

### Layer 4: Inner Circle
- **Shape**: Circle
- **Size**: 48px diameter
- **Fill**: Radial gradient (gold with transparency)
- **Border**: `border-[#BF953F]/50`
- **Animation**: Scale pulse (1.0 → 1.1 → 1.0)

### Layer 5: Orbiting Particles
- **Count**: 2 particles
- **Size**: 8px × 8px circles
- **Colors**: #FCF6BA and #BF953F
- **Orbits**:
  - Particle 1: 3s clockwise
  - Particle 2: 4s counter-clockwise (offset 0.5s)
- **Shadow**: Glow effect matching color

### Layer 6: Shimmer Overlay
- **Effect**: Horizontal gradient sweep
- **Colors**: Transparent → gold/20 → transparent
- **Animation**: 2.5s continuous sweep
- **Blend**: Overlay on top of geometry

### Layer 7: Text Content
- **"Loading" text**:
  - Font: Cinzel
  - Size: text-lg (18px)
  - Color: Gold gradient clip
  - Animation: Pulse opacity

- **Optional message**:
  - Font: Inter
  - Size: text-sm (14px)
  - Color: slate-400
  - Animation: Fade in when present

### Layer 8: Bouncing Dots
- **Count**: 3 dots
- **Size**: 8px × 8px
- **Colors**: #BF953F, #FCF6BA, #B38728
- **Animation**: Staggered bounce
  - Dot 1: 0s delay
  - Dot 2: 0.15s delay
  - Dot 3: 0.3s delay

## Color Palette

### Primary Colors
```
Gold Light:  #FCF6BA  ■  rgb(252, 246, 186)
Gold Mid:    #BF953F  ■  rgb(191, 149, 63)
Gold Dark:   #B38728  ■  rgb(179, 135, 40)
```

### Background Colors
```
Slate 900:   #0f172a  ■  rgb(15, 23, 42)
Slate 800:   #1e293b  ■  rgb(30, 41, 59)
Slate 700:   #334155  ■  rgb(51, 65, 85)
Slate 400:   #94a3b8  ■  rgb(148, 163, 184)
```

### Transparency Layers
```
Gold Light /30:  rgba(252, 246, 186, 0.3)
Gold Mid /50:    rgba(191, 149, 63, 0.5)
Gold Mid /20:    rgba(191, 149, 63, 0.2)
Slate 900 /95:   rgba(15, 23, 42, 0.95)
```

## Animation Timings

### Durations
```
Instant:    150ms   (reduced motion, quick transitions)
Fast:       250ms   (micro-interactions)
Normal:     350ms   (standard transitions)
Slow:       500ms   (emphasized transitions)
Emphasis:   750ms   (important state changes)
```

### Easing Functions
```
Standard:    cubic-bezier(0.25, 0.46, 0.45, 0.94)  - General purpose
Decelerate:  cubic-bezier(0.16, 1, 0.3, 1)         - Enter animations
Accelerate:  cubic-bezier(0.755, 0.05, 0.855, 0.06)- Exit animations
Expressive:  t * t * (3 - 2 * t)                   - Micro-interactions
```

### Rotation Speeds
```
Outer Hexagon:    8s  per rotation (45°/s)
Middle Diamond:   6s  per rotation (60°/s)
Particle 1:       3s  per orbit (120°/s)
Particle 2:       4s  per orbit (90°/s)
```

### Pulse Cycles
```
Opacity Pulse:    2s  cycle (1.0 → 0.3 → 1.0)
Scale Pulse:      2s  cycle (1.0 → 1.1 → 1.0)
Shimmer Sweep:    2.5s cycle (full sweep)
Dot Bounce:       1.4s cycle (up → down → up)
```

## Responsive Sizing

### Desktop (≥1024px)
```
Container:      128px × 128px
Hexagon:        100% of container
Diamond:        62.5% of container (80px)
Circle:         37.5% of container (48px)
Particles:      8px diameter
Text:           18px (Cinzel)
Message:        14px (Inter)
Dots:           8px diameter
```

### Tablet (768px - 1023px)
```
Container:      128px × 128px (same)
All proportions maintained
```

### Mobile (<768px)
```
Container:      128px × 128px (same)
All proportions maintained
Touch-friendly spacing maintained
```

## Accessibility Considerations

### Screen Reader Content
```html
<div role="status" aria-live="polite" aria-label="Loading content">
  <!-- Visual loader -->
  <span class="sr-only">Loading content, please wait</span>
</div>
```

### Reduced Motion
When `prefers-reduced-motion: reduce` is active:
- All rotations stop
- Pulses become static
- Orbital particles freeze
- Shimmer effect stops
- Only fade transition remains (150ms)
- Static opacity: 0.8 (visible but not distracting)

### Focus Management
- No focusable elements in loader
- Focus remains on trigger element
- No keyboard trap created
- Natural focus restoration after loading

## CSS Custom Properties (Future Enhancement)

```css
:root {
  /* Colors */
  --loader-gold-light: #FCF6BA;
  --loader-gold-mid: #BF953F;
  --loader-gold-dark: #B38728;
  --loader-bg: rgba(15, 23, 42, 0.95);

  /* Sizes */
  --loader-container-size: 128px;
  --loader-hexagon-size: 100%;
  --loader-diamond-size: 62.5%;
  --loader-circle-size: 37.5%;
  --loader-particle-size: 8px;

  /* Timings */
  --loader-rotation-slow: 8s;
  --loader-rotation-medium: 6s;
  --loader-rotation-fast: 3s;
  --loader-pulse-duration: 2s;
  --loader-shimmer-duration: 2.5s;
  --loader-bounce-duration: 1.4s;
}
```

## SVG Gradient Definitions

### Gold Gradient 1 (Outer Hexagon)
```svg
<linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#BF953F" stop-opacity="1" />
  <stop offset="50%" stop-color="#FCF6BA" stop-opacity="1" />
  <stop offset="100%" stop-color="#B38728" stop-opacity="1" />
</linearGradient>
```

### Gold Gradient 2 (Middle Diamond)
```svg
<linearGradient id="goldGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stop-color="#B38728" stop-opacity="1" />
  <stop offset="50%" stop-color="#FCF6BA" stop-opacity="1" />
  <stop offset="100%" stop-color="#BF953F" stop-opacity="1" />
</linearGradient>
```

## Performance Characteristics

### GPU Acceleration
All transforms use `translateZ(0)` to trigger GPU acceleration:
- Rotations: `transform: rotate() translateZ(0)`
- Scales: `transform: scale() translateZ(0)`
- Translations: `transform: translate() translateZ(0)`

### Paint Optimization
- Contained animations (no layout reflow)
- Fixed positioning (no document flow impact)
- `will-change: transform, opacity` hints
- Rounded corners on contained elements

### Animation Frame Rate
- Target: 60fps (16.67ms per frame)
- CSS-based animations (browser-optimized)
- No JavaScript animation loops
- Hardware-accelerated properties only

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Backdrop Filter | 76+ | 103+ | 9+ | 79+ |
| CSS Animations | All | All | All | All |
| SVG Gradients | All | All | All | All |
| Transform 3D | All | All | All | All |
| Reduced Motion | 74+ | 63+ | 10.1+ | 79+ |

## Implementation Notes

### Z-Index Stack
```
9999  - PageLoader overlay
1000  - Navbar
100   - Modals
10    - Dropdowns
1     - Cards/Content
0     - Base content
```

### Animation Triggers
- **Entrance**: When `isLoading` changes to `true`
- **Exit**: When `isLoading` changes to `false`
- **Duration**: 300ms fade in, 200ms fade out
- **Timing**: Matches route navigation timing

### State Management
```javascript
// Store state
{
  isLoading: boolean,    // Visibility control
  message: string,       // Optional message
  progress: number       // 0-100 (reserved for future)
}
```

## Testing Checklist

### Visual Testing
- [ ] Hexagon rotates smoothly clockwise
- [ ] Diamond rotates smoothly counter-clockwise
- [ ] Circle pulses with scale animation
- [ ] Particles orbit at different speeds
- [ ] Shimmer sweeps horizontally
- [ ] Dots bounce with staggered timing
- [ ] Text gradient animates
- [ ] Message fades in when present
- [ ] Colors match brand palette

### Functional Testing
- [ ] Shows on navigation start
- [ ] Hides on navigation complete
- [ ] Shows on manual `loading.start()`
- [ ] Hides on manual `loading.stop()`
- [ ] Message updates dynamically
- [ ] No flicker on quick operations
- [ ] Smooth entrance/exit transitions

### Accessibility Testing
- [ ] Screen reader announces loading
- [ ] Reduced motion disables animations
- [ ] No keyboard trap
- [ ] Focus management correct
- [ ] ARIA attributes present
- [ ] Semantic HTML structure

### Performance Testing
- [ ] 60fps animation frame rate
- [ ] No layout shift
- [ ] GPU acceleration active
- [ ] Memory doesn't leak
- [ ] Quick hide/show doesn't stack
- [ ] Works on slow devices
