# Project Guidelines

## Tech Stack

- React 19, Vite 6.3, Zustand 5.0
- Tailwind CSS 4.1.4
- Vitest, ESLint, Prettier

## Code Standards

- **Quality Checks**: Run `npm run test && npm run lint` before submitting changes
- **Code Hygiene**: Remove dead code, unused variables, imports, and leftover comments
- **Maintainability**: Keep code clean, follow existing styles and patterns
- **Compatibility**: Backward compatibility only required when specified or critical

## Testing Approach

- **Focus Areas**:
  - Critical path functionality over full coverage
  - Core business logic and user-facing features
  - Basic smoke tests for all new features
- **Priorities**:
  - Core calculation functions
  - State management logic
  - Critical user interactions
- **Requirements**: Unit tests not mandatory for all components

## Environment & Agent Guidance

- All commands are executed from the project root directory.
- Node.js and all npm packages are already installed.
- The project is a git repository. Use `git diff`, `git log`, or other read-only git commands to investigate code history as needed.
- Do not perform git commits, create branches, or modify the git state unless directly instructed.
- Use npm (`npm run lint`, `npm run test`) for code quality and testing.
- Only reference file contents or code snippets if relevant to the current request.
