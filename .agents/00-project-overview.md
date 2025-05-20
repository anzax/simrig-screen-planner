# SimRig Screen Planner Project Overview v3

_May 19, 2025_

## Purpose

Calculate and visualize optimal sim racing screen configurations (angles, FOV, space requirements) for both flat and curved screens, providing a comprehensive tool for sim racing enthusiasts.

## Current Tech Stack

- **Monorepo Structure**: PNPM workspace with multiple packages
- **Screen Planner App**: React 19, Vite 6.3, Zustand 5.0, Tailwind CSS 4.1.4, D3 7.9
- **Core Package**: Preact with Signals (in initial setup phase)
- **Content Hub**: Astro 5.7 with Preact integration
- **Testing**: Vitest, React Testing Library
- **Deployment**: Cloudflare Pages

## Key Components

### Packages

1. **@simrigbuild/screen-planner** (React app)

   - Current production version, fully functional
   - SVG-based visualization with D3 for curved screens
   - Zustand state management with persistence

2. **@simrigbuild/screen-planner-core** (Preact/TypeScript library)

   - In initial setup phase
   - Will house core calculations and visualization primitives
   - Uses Preact Signals for state management
   - Designed to be published as an npm package

3. **@simrigbuild/content-hub** (Astro site)
   - Basic setup with minimal pages
   - Will eventually host the reimplemented screen planner
   - Will serve as the primary user interface

## Features

- **Input Parameters:**

  - Screen size (17-77")
  - Aspect ratio (16:9, 21:9, 32:9)
  - Eye distance (50-150cm)
  - Bezels (0-50mm)
  - Single/triple setup
  - Flat/curved screens (800-1800mm radius)
  - Manual dimension input option

- **Output Calculations:**
  - Side screen angles
  - Horizontal/vertical FOV
  - Total space requirements
  - SVG visualization (top-down view)

## Architecture

### Current Architecture (screen-planner)

- **State Management**: Zustand stores (useSettingsStore, useUIStore)
- **Core Flow**: App → useScreenCalculations → calculateScreenGeometry → calculateSvgLayout
- **Components**: SettingsPanel, StatsDisplay, ScreenVisualizer (SVG-based)

### Target Architecture (screen-planner-core + content-hub)

- **Domain Layer**: Pure TypeScript interfaces and types
- **Calculation Layer**: Pure functions for geometry calculations
- **State Layer**: Signal-based state management
- **Visualization Layer**: Framework-agnostic rendering
- **UI Layer**: Astro/Preact components in content hub

## Migration Plan

1. Extract core calculations and types to screen-planner-core
2. Implement state management with Preact Signals
3. Create visualization primitives
4. Build UI components in content-hub
5. Launch reimplemented version and deprecate original

## Deployment

- Primary domain: simrigbuild.com (Cloudflare Pages)
- Analytics: Cloudflare Analytics
- Search: Registered with Google Search Console
- Infrastructure: Cloudflare KV for configuration sharing (planned)

## Immediate Priorities

1. Complete screen-planner-core implementation
2. Develop content hub layout and structure
3. Enhance mobile experience
4. Add educational content about FOV and screen setups
