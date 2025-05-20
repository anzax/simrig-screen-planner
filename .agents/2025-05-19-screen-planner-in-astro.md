## Recommended Approach for `/screen-planner` UI

### Architecture Decision

I recommend using **Astro with Preact islands** for the UI, which aligns perfectly with your migration goals. This approach gives you:

1. Static HTML where possible for fast loading
2. Interactive Preact islands where needed for functionality
3. Clear separation of concerns between presentation and logic

### Implementation Strategy

Here's how I'd structure the screen planner page:

1. **Static Layout with Astro**

   - Use Astro for the basic page structure and layout
   - Load your core styles and configuration

2. **State Management with Preact Signals**

   - Create a client-side state provider using Preact Signals
   - Port your Zustand-based state to Signals in the core package

3. **Interactive Islands**
   - Set up individual Preact components for interactive parts
   - Use client:load directive for key interactive components

### Detailed Implementation Plan

#### 1. Core Package Implementation

First, implement the core state and calculation logic in `screen-planner-core`:

```typescript
// packages/screen-planner-core/src/state/screenConfig.ts
import { signal, computed } from '@preact/signals'

// Define core types
export type AspectRatio = '16:9' | '21:9' | '32:9'
export type SetupType = 'single' | 'triple'
export type InputMode = 'diagonal' | 'manual'
export type AngleMode = 'auto' | 'manual'

// Create default state
export const createScreenConfigState = () => {
  // Main configuration signals
  const screen = {
    diagIn: signal(32),
    ratio: signal<AspectRatio>('16:9'),
    bezelMm: signal(0),
    screenWidth: signal(700),
    screenHeight: signal(400),
    inputMode: signal<InputMode>('diagonal'),
  }

  const distance = {
    distCm: signal(60),
  }

  const layout = {
    setupType: signal<SetupType>('triple'),
    manualAngle: signal(60),
    angleMode: signal<AngleMode>('auto'),
  }

  const curvature = {
    isCurved: signal(false),
    curveRadius: signal(1000),
  }

  // Computed values
  const calculatedResults = computed(() => {
    // Port your calculation logic here from calculationStore
    // This will automatically update when any dependency signal changes

    return {
      sideAngleDeg: 0, // Replace with actual calculation
      hFOVdeg: 0,
      vFOVdeg: 0,
      totalWidth: 0,
    }
  })

  // Visualization data
  const visualizationData = computed(() => {
    // Port your visualization calculations here

    return {
      // SVG visualization data
    }
  })

  return {
    screen,
    distance,
    layout,
    curvature,
    calculatedResults,
    visualizationData,
  }
}

// Export a singleton instance for client-side use
export const screenConfig = createScreenConfigState()
```

#### 2. Astro Page Structure

Update your `screen-planner.astro` page:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ScreenPlannerApp from '../components/screen-planner/ScreenPlannerApp';
---

<BaseLayout title="Screen Planner">
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <header class="flex items-center h-10 mb-2">
      <a href="https://simrigbuild.com" class="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors">SimRigBuild.com</a>
      <span class="mx-2 text-gray-400">/</span>
      <h1 class="text-xl font-medium">Screen Planner</h1>
    </header>

    <!-- Mount the main Preact application with client:load -->
    <ScreenPlannerApp client:load />

    <!-- Static footer content remains in Astro -->
    <footer class="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
      <!-- Footer content -->
    </footer>
  </div>
</BaseLayout>
```

#### 3. Main Preact Component

Create a main Preact component that loads the interactive parts:

```tsx
// packages/content-hub/src/components/screen-planner/ScreenPlannerApp.tsx
import { FunctionalComponent } from 'preact'
import { screenConfig } from '@simrigbuild/screen-planner-core'
import SettingsPanel from './SettingsPanel'
import StatsDisplay from './StatsDisplay'
import ScreenVisualizer from './ScreenVisualizer'

const ScreenPlannerApp: FunctionalComponent = () => {
  return (
    <>
      <SettingsPanel config={screenConfig} />
      <StatsDisplay results={screenConfig.calculatedResults} />
      <ScreenVisualizer data={screenConfig.visualizationData} />
    </>
  )
}

export default ScreenPlannerApp
```

#### 4. Interactive Components

Split your UI into individual Preact islands:

```tsx
// packages/content-hub/src/components/screen-planner/SettingsPanel.tsx
import { FunctionalComponent } from 'preact'
import MultiToggle from '../ui/MultiToggle'
import NumberInputWithSlider from '../ui/NumberInputWithSlider'
import Card from '../ui/Card'

const SettingsPanel: FunctionalComponent = ({ config }) => {
  // Access signals directly from the config object
  const { screen, distance, layout, curvature } = config

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Screen Size column */}
        <div>
          <h2 class="text-sm font-medium text-gray-700 mb-2">Screen Size</h2>
          <MultiToggle
            value={screen.inputMode.value}
            options={[
              { value: 'diagonal', label: 'Diagonal' },
              { value: 'manual', label: 'Width×Height' },
            ]}
            onChange={value => (screen.inputMode.value = value as 'diagonal' | 'manual')}
          />
          {/* More inputs */}
        </div>

        {/* Additional columns */}
      </div>
    </section>
  )
}

export default SettingsPanel
```

```tsx
// packages/content-hub/src/components/screen-planner/StatsDisplay.tsx
import { FunctionalComponent } from 'preact'
import Card from '../ui/Card'

const StatsDisplay: FunctionalComponent = ({ results }) => {
  return (
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-center mb-2">
          <span class="inline-block text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            Main Setup
          </span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <Card
            v={`${results.value.hFOVdeg.toFixed(0)}°`}
            l="H-FOV"
            tooltip="Horizontal field-of-view"
          />
          <Card
            v={`${results.value.vFOVdeg.toFixed(0)}°`}
            l="V-FOV"
            tooltip="Vertical field-of-view"
          />
          <Card
            v={`${results.value.sideAngleDeg.toFixed(0)}°`}
            l="Side Angle"
            tooltip="Recommended monitor angle"
          />
          <Card
            v={`${results.value.totalWidth.toFixed(0)} cm`}
            l="Total Width"
            tooltip="Overall monitor span"
          />
        </div>
      </div>
      {/* Comparison panel */}
    </section>
  )
}

export default StatsDisplay
```

```tsx
// packages/content-hub/src/components/screen-planner/ScreenVisualizer.tsx
import { FunctionalComponent } from 'preact'
import { useRef, useEffect } from 'preact/hooks'

const ScreenVisualizer: FunctionalComponent = ({ data }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    // Implement visualization rendering using the data
    // Port your D3 code or SVG generation here
  }, [data.value])

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div ref={svgRef} class="w-full h-64">
        {/* SVG will be rendered here */}
      </div>
    </section>
  )
}

export default ScreenVisualizer
```

## Key Recommendations

1. **Progressive implementation**: Begin with a simplified version of the visualization and add complexity as you go.

2. **Hydration strategy**: Use `client:load` for the main interactive components that need to be responsive immediately upon page load.

3. **Minimal islands**: Keep the number of islands minimal to optimize hydration - group related functionality in the same island when possible.

4. **TypeScript throughout**: Use TypeScript for both packages to ensure type safety between core and UI.

5. **Responsive design**: Continue using your minimalistic UI approach with responsive Tailwind CSS classes.

By following this architecture, you'll achieve your goal of separating the core calculation/visualization logic from the UI while maintaining the familiar minimal design of your current Screen Planner. This approach also sets you up well for future expansion into a comprehensive SimRig Hub.
