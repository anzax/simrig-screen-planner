# Project Guidelines

## Code Standards

- **Code Hygiene**: Remove dead code, unused variables, imports, and leftover comments
- **Maintainability**: Follow existing styles and patterns
- **Compatibility**: Backward compatibility only required when specified or critical

## Testing Strategy

- **Focus Areas**:
  - Critical path functionality over full coverage
  - Core business logic and user-facing features
  - Basic smoke tests for all new features
- **Priorities**:
  - Core calculation functions
  - State management logic
  - Critical user interactions
- **Note**: Unit tests not mandatory for all components

## Environment Notes

- All commands execute from project root
- Node.js and dependencies are pre-installed
- Git repository access:
  - Use read-only commands (`git diff`, `git log`) to explore code history
  - Don't modify git state unless instructed
- Reference code snippets only when relevant to current task
