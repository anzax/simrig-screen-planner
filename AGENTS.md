# Project Guidelines

## Agent Documentation

- **`.agents` Directory**: Contains context files for coding agents:
  - Project overviews and architecture
  - Changelogs and version history
  - Migration guides and ADRs (Architecture Decision Records)
  - Implementation strategies
- **Documentation Status**: All provided documentations and ADRs are not set in stone - agents should feel free to propose alternatives where reasonable
- **Version Awareness**: Pay attention to dates and timestamps in file names or inside content to understand the evolution of decisions

## Documentation Index

- **Project Overview**: [00-project-overview.md](/.agents/00-project-overview.md) - Current state as of May 19, 2025
- **Project History**: [10-changelog.md](/.agents/10-changelog.md) - Development timeline
- **Migration Guide**: [2025-05-18-migration-guide.md](/.agents/2025-05-18-migration-guide.md) - Monorepo restructuring
- **Implementation Strategy**: [2025-05-19-screen-planner-in-astro.md](/.agents/2025-05-19-screen-planner-in-astro.md) - UI approach

## Implementation Specifications

- **Type-First Development**: All implementations start with well-defined TypeScript interfaces
- **Spec**: Use provided Spec as the basis for all implementation tasks
- **Decision Making**: Make reasonable decisions without waiting for clarification on minor details
- **Document Choices**: Explain significant design decisions in PR descriptions

## Implementation Approach

- **Interface-First**: Begin by understanding the domain interfaces that define boundaries
- **Test-Driven**: Write tests before implementation based on requirements
- **Layer Separation**: Maintain clear boundaries between domain, calculation, state, and visualization
- **Proactive Improvement**: Enhance designs when clearly beneficial without breaking interfaces
- **Decisiveness**: Use best judgment to move forward rather than waiting for perfect information

## Code Standards

- **Code Hygiene**: Remove dead code, unused variables, imports, and leftover comments
- **Maintainability**: Follow existing styles and patterns
- **Compatibility**: Backward compatibility only required when specified or critical
- **Pure Functions**: Keep calculation functions pure with no side effects
- **Clear Boundaries**: Respect layer separation in the architecture

## Testing and Submission Checklist

- **Test, Lint, Format**: Before submitting any code, always run all tests, linters, and code formatters to ensure code quality and consistency.
  - `pnpm format`
  - `pnpm lint`
  - `pnpm test`
- **Focus Areas for Testing**:
  - Critical path functionality over full coverage
  - Core business logic and user-facing features
  - Basic smoke tests for all new features
- **Testing Priorities**:
  - Core calculation functions
  - State management logic
  - Critical user interactions
- **PR Format**:
  - Brief implementation summary
  - Explanation of key design decisions
  - How tests verify the requirements

## Environment Notes

- All commands execute from project root
- Node.js and dependencies are pre-installed
