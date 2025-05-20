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

## Code Standards

- **Code Hygiene**: Remove dead code, unused variables, imports, and leftover comments
- **Maintainability**: Follow existing styles and patterns
- **Compatibility**: Backward compatibility only required when specified or critical

## Testing and Submission Checklist

- **Test, Lint, Format**: Before submitting any code, always run all tests, linters, and code formatters to ensure code quality and consistency.
- **Focus Areas for Testing**:
  - Critical path functionality over full coverage
  - Core business logic and user-facing features
  - Basic smoke tests for all new features
- **Testing Priorities**:
  - Core calculation functions
  - State management logic
  - Critical user interactions
- **Note**: Unit tests not mandatory for all components

## Environment Notes

- All commands execute from project root
- Node.js and dependencies are pre-installed
