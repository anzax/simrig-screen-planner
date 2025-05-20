# SimRig Screen Planner Monorepo Migration Overview

## Current Project Structure

The SimRig Screen Planner currently exists as a monorepo with these key packages:

1. **packages/screen-planner**: A React-based application (React 19, Zustand 5.0) that contains:

   - Core FOV and screen angle calculations
   - State management using Zustand
   - SVG-based visualization with D3 for curved screens
   - UI components for configuration and display

2. **packages/screen-planner-core**: A newly created package with minimal setup:

   - Basic TypeScript and Preact configuration
   - Currently empty, waiting for implementation

3. **packages/content-hub**: An Astro-based website:
   - Basic setup with minimal pages
   - Will eventually host the reimplemented screen planner

## Migration Goals

We're performing a complete architecture redesign with these objectives:

1. Separate core calculation/visualization logic from UI
2. Move from React+Zustand to Preact+Signals for better performance
3. Create a package for the core functionality
4. Host the new implementation in an Astro-based content hub
5. Support future expansion into a comprehensive SimRigBuild Hub

## New Architecture

The new architecture will consist of:

### 1. Core Package (`@simrigbuild/screen-planner-core`)

- **Purpose**: Core calculations, visualization primitives, state management
- **Technology**: Preact + Signals
- **Key Components**:
  - Domain models and type definitions
  - Pure calculation functions for geometry and FOV
  - Signal-based state management
  - SVG visualization primitives (no UI components)
  - Composition API for integration

### 2. Content Hub (`@simrigbuild/content-hub`)

- **Purpose**: User interface, content, and hosting
- **Technology**: Astro + Tailwind CSS
- **Key Components**:
  - UI components built using the core package
  - Educational content about FOV and screen setups
  - Blog posts and guides
  - Screen planner application page

## Implementation Details

### Core Package Design

The core package follows a clean architecture with these layers:

1. **Domain Layer**: Pure TypeScript interfaces and types

   - Screen configurations
   - Geometry types
   - Calculation results

2. **Calculation Layer**: Pure functions for all geometry calculations

   - Screen dimension calculations
   - FOV algorithms
   - Angle determination
   - Curved screen geometry

3. **State Layer**: Signal-based state management

   - Configuration signals
   - Derived calculation signals
   - Persistence utilities

4. **Visualization Layer**: Framework-agnostic rendering
   - SVG coordinate calculations
   - Screen rendering primitives
   - FOV visualization utilities

### Content Hub Integration

The content hub will integrate the core package by:

1. Importing the core package's visualization primitives and state
2. Building UI components around these primitives
3. Creating a complete screen planner experience
4. Adding educational content and guides

## Migration Process

The migration will proceed in these phases:

1. **Extract core domain models and calculations**

   - Port geometry calculations to TypeScript
   - Create clean interfaces and types
   - Ensure all calculations are pure functions
   - Add comprehensive test coverage

2. **Implement state management with Signals**

   - Replace Zustand with Preact Signals
   - Set up derived signals for calculations
   - Implement persistence

3. **Build visualization primitives**

   - Create SVG renderer components
   - Support both flat and curved screens
   - Implement FOV visualization
   - Create coordinate transformation utilities

4. **Create content hub UI components**

   - Build settings panel components
   - Create stats display components
   - Design layout and responsive UI
   - Integrate core visualization

5. **Finalize content and deployment**
   - Add educational content
   - Create documentation
   - Set up deployment pipeline
   - Test and launch

## Technical Constraints

- **Minimal UI in Core**: The core package should contain only visualization primitives, not UI components
- **Type Safety**: All interfaces between core and content hub should be strongly typed
- **Composition Pattern**: Use composition over inheritance for component design
- **Performance Focus**: Optimize for performance, especially in visualization
- **Testability**: All core functions should be easily testable

## Next Steps

Focus on implementing the core package first:

1. Set up the directory structure for clean separation of concerns
2. Port the geometry calculations to TypeScript with proper interfaces
3. Implement the state management with Signals
4. Create the basic visualization primitives
5. Establish the public API for the core package

Once the core functionality is working, move on to building the content hub components and integrating the core package.
