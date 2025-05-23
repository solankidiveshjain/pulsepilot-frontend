# PulsePilot Frontend

PulsePilot is a modern social media management platform focused on comment management, audience segmentation, and engagement analytics.

## Tech Stack

- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components
- **State Management**: Zustand & TanStack Query
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form
- **Icons**: Lucide
- **Testing**: Jest, React Testing Library, Playwright

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/pulsepilot-frontend.git
   cd pulsepilot-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   touch .env.local
   ```

   Add required environment variables in `.env.local`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Guidelines

### Project Structure

This project follows atomic design principles (atoms, molecules, organisms, templates, pages) for component organization. See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for details on directory organization and coding standards.

### Design Guidelines

We maintain strict design and implementation guidelines to ensure consistency and quality:

- General React best practices: [docs/react-best-practices.md](./docs/react-best-practices.md)
- Comments interface specific guidelines: [docs/comments-interface-guidelines.md](./docs/comments-interface-guidelines.md)

All pull requests must adhere to these guidelines or they will be rejected.

### Performance Guidelines

Use memoization (React.memo, useMemo, useCallback) to minimize re-renders
Implement code splitting with dynamic imports for routes and large components
Use Next.js Image component for all images to ensure proper optimization
Implement virtualization for long lists using react-window (not react-virtualized)
Implement proper loading states and skeleton screens during data fetching

### State Management

- Keep state as close as possible to where it's used
- Use React Context for global state that changes infrequently
- Implement Zustand for more complex global state management
- Use TanStack Query for server state management and API communication
- Always maintain immutability when updating state

### Accessibility (A11y)

- Use semantic HTML elements
- Include proper ARIA labels and roles where needed
- Ensure keyboard navigation works throughout the application
- Provide adequate color contrast (WCAG AA compliance)
- Test with screen readers
- Support focus management, especially for modals and dialogs

### Type Safety

- Use TypeScript strict mode throughout the codebase
- Define explicit return types for all functions
- Create comprehensive interfaces/types for all data structures
- Avoid using 'any' type - use unknown if type is truly unknown

### Code Quality

Linting: Run `npm run lint` to check for linting errors
Development: Run `npm run dev` to start the development server
Build: Run `npm run build` to create a production build

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features or enhancements
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

Example: `feat(auth): add social login functionality`

### Pull Requests

- Create a pull request against the `develop` branch
- Fill out the PR template
- Ensure all checks pass
- Request a review from appropriate reviewers

## Testing

Testing scripts are not yet configured.

## Production Build

```bash
npm run build
npm run start
```

## Documentation

API documentation is available through OpenAPI specs

## Deployment

CI/CD pipeline documentation is available in [DEPLOYMENT.md](./DEPLOYMENT.md)

## Performance Monitoring

Performance monitoring dashboards and tools are available to team members. Contact the DevOps team for access.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary software owned by PulsePilot, Inc.
