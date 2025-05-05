# Triple-Screen Planner Project Overview v1

_Snapshot: May 4, 2025_

## Application Purpose

Calculate optimal triple-screen configurations for sim racing setups. Determines screen angles, field of view, and spatial requirements for racing simulator configurations.

## Technology Stack

- **React 19**: Functional components with hooks
- **Vite**: Build tool
- **Tailwind CSS 4.1.4**: Styling
- **ESLint**: Code linting
- **gh-pages**: Deployment

## Core Features

### Input Parameters

- Screen Size: 17-77 inches (diagonal)
- Aspect Ratio: 16:9 / 21:9
- Eye-to-Screen Distance: 50-150 cm
- Bezel Size: 0-50 mm

### Calculated Outputs

- Side Screen Angle
- Horizontal FOV
- Vertical FOV
- Total Setup Width
- Live SVG visualization

## Architecture

### Component Structure

```
App.jsx
├── State: useState for inputs
├── Calculations: useMemo for geometry
├── SVG: Dynamic rendering
└── UI: Slider, Card components
```

### Key Algorithms

**Side Screen Angle**

```javascript
const x_c = (W * d * d) / (d * d + a * a)
const sideAngleDeg = (Math.abs(Math.atan2(u_y, u_x)) * 180) / Math.PI
```

**Horizontal FOV**

```javascript
const hFOVdeg = ((hFOVrad * 180) / Math.PI) * 3 + ((2 * Math.atan(bezel / d) * 180) / Math.PI) * 2
```

## File Structure

```
src/
├── App.jsx      # Main component
├── main.jsx     # Entry point
└── index.css    # Tailwind imports
package.json     # Dependencies
index.html       # HTML template
```

## Dependencies

**Production**

- react: 19.0.0
- react-dom: 19.0.0
- tailwindcss: 4.1.4
- gh-pages: 6.3.0

**Development**

- vite: 6.3.1
- eslint: 9.22.0
- @vitejs/plugin-react: 4.3.4

## Build Commands

```bash
npm run dev      # Development
npm run build    # Production build
npm run deploy   # Deploy to GitHub Pages
```

## Visual Elements

- SVG diagram with top-view representation
- Standard sim cockpit: 60cm × 150cm
- Head position: Red circle
- Screen outline and angles

---

_v1 Snapshot: May 4, 2025_
