# PulsePilot Frontend Project Structure

## Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication routes (login, signup, etc.)
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── onboarding/       # Onboarding flow
│   │   └── layout.tsx        # Layout for auth routes
│   ├── (dashboard)/          # Dashboard routes (protected)
│   │   ├── comments/         # Comments management
│   │   │   ├── [[...filters]]/ # Dynamic filtering routes
│   │   │   └── [id]/         # Single comment view
│   │   ├── audience/         # Audience segmentation
│   │   ├── analytics/        # Analytics & reporting
│   │   ├── settings/         # User settings
│   │   └── layout.tsx        # Dashboard layout
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── ui/                   # ShadCN UI components
│   ├── auth/                 # Authentication components
│   ├── dashboard/            # Dashboard-specific components
│   │   ├── navigation/       # Navigation components
│   │   ├── cards/            # Dashboard cards
│   │   └── widgets/          # Dashboard widgets
│   ├── comments/             # Comment-related components
│   │   ├── card/             # Comment card components
│   │   ├── filters/          # Comment filtering components
│   │   └── actions/          # Comment action components
│   ├── audience/             # Audience-related components
│   ├── analytics/            # Analytics components
│   └── providers/            # Context providers
├── hooks/                    # Custom React hooks
│   ├── use-comments.ts       # Comments related hooks
│   ├── use-auth.ts           # Authentication hooks
│   └── use-*.ts              # Other hooks
├── lib/                      # Utility libraries
│   ├── store/                # Global state management
│   │   ├── slices/           # State slices
│   │   └── index.ts          # Store configuration
│   ├── api/                  # API client
│   ├── animations/           # Animation utilities
│   ├── utils/                # Helper functions
│   └── types/                # TypeScript type definitions
├── styles/                   # Global styles
│   └── globals.css           # Global CSS styles
├── public/                   # Static assets
│   ├── fonts/                # Custom fonts
│   └── images/               # Images
└── tests/                    # Test files
    ├── unit/                 # Unit tests
    ├── integration/          # Integration tests
    └── e2e/                  # End-to-end tests
```

## Coding Standards & Best Practices

### 1. Performance Optimization

- **Code Splitting**: Use dynamic imports for route-based code splitting
- **Image Optimization**: Use Next.js Image component for optimized images
- **Bundle Analysis**: Regularly analyze and optimize bundle size
- **Lazy Loading**: Implement lazy loading for below-the-fold content
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Tree Shaking**: Ensure proper imports for tree shaking support

### 2. TypeScript Best Practices

- **Strict Type Checking**: Enable strict mode in tsconfig.json
- **Type Definitions**: Create comprehensive type definitions for all data structures
- **Interfaces vs Types**: Use interfaces for objects that can be extended, types for unions/intersections
- **Avoid Any**: Minimize use of `any` type
- **Discriminated Unions**: Use for complex state management
- **Generic Types**: Leverage for reusable components and functions

### 3. Component Architecture

- **Atomic Design**: Organize components following atomic design principles
- **Composition**: Favor composition over inheritance
- **Component Sizing**: Keep components focused on a single responsibility
- **Props Interface**: Define clear prop interfaces for every component
- **Controlled vs Uncontrolled**: Prefer controlled components for form elements
- **Container/Presentation Pattern**: Separate logic from presentation when beneficial

### 4. State Management

- **Local State**: Use useState for component-specific state
- **Global State**: Use Zustand or TanStack Store for global state
- **Form State**: Leverage React Hook Form for complex forms
- **Server State**: Implement TanStack Query for server state management
- **Immutability**: Always maintain immutability when updating state
- **State Colocation**: Keep state as close as possible to where it's used

### 5. Styling Approach

- **Tailwind CSS**: Use utility-first approach for styling
- **Component Variants**: Implement with class-variance-authority for dynamic styling
- **Design Tokens**: Utilize design tokens for consistent theming
- **Dark Mode**: Support system preference and user preference
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Custom Styles**: Use CSS modules or styled-components for complex custom styles

### 6. Testing Strategy

- **Unit Testing**: Jest + React Testing Library for component testing
- **Integration Testing**: Test components working together
- **E2E Testing**: Playwright for end-to-end testing
- **Mock Services**: Mock API services in tests
- **Test Coverage**: Aim for 80%+ coverage on business logic
- **Visual Regression**: Implement for UI component stability

### 7. Error Handling

- **Error Boundaries**: Implement for graceful UI recovery
- **Input Validation**: Client-side validation with proper feedback
- **Form Errors**: Inline error messages with proper accessibility
- **API Errors**: Standardized error handling for API responses
- **Fallbacks**: Provide fallback UI for error states
- **Logging**: Proper error logging for production debugging

### 8. Accessibility (A11y)

- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Attributes**: Implement where necessary
- **Keyboard Navigation**: Ensure full keyboard navigability
- **Focus Management**: Proper focus handling for modal dialogs
- **Color Contrast**: Meet WCAG 2.1 AA standards
- **Screen Reader Support**: Test with screen readers

### 9. Code Quality Tools

- **ESLint**: Static code analysis
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit formatting and linting
- **TypeScript**: Static type checking
- **Jest**: Unit and integration testing
- **Playwright**: End-to-end testing

### 10. Version Control Practices

- **Conventional Commits**: Follow conventional commit format
- **Branch Strategy**: Feature/bugfix branches merged via pull requests
- **PR Templates**: Standardized pull request templates
- **Code Reviews**: Required before merging
- **CI/CD**: Automated testing and deployment pipelines

### 11. Documentation

- **Component Documentation**: Document props, behavior, and usage examples
- **API Documentation**: Document API endpoints and data structures
- **Code Comments**: Comment complex logic and why (not what)
- **README**: Maintain comprehensive project README with setup instructions
- **Storybook**: Visual documentation of UI components

### 12. Performance Monitoring

- **Core Web Vitals**: Monitor LCP, FID, CLS metrics
- **Error Tracking**: Implement error tracking service
- **User Flow Analysis**: Track user paths and interactions
- **API Performance**: Monitor API request times
- **Bundle Size**: Track bundle size changes over time

## Development Workflow

1. **Feature Planning**: Define requirements and acceptance criteria
2. **Component Design**: Design component structure and interfaces
3. **Implementation**: Develop features with TDD approach where possible
4. **Testing**: Write unit, integration, and E2E tests as needed
5. **Review**: Code review and quality assurance
6. **Deployment**: Automated deployment via CI/CD pipeline
7. **Monitoring**: Performance and error monitoring in production

## Getting Started

Follow the instructions in the main README.md file to set up your development environment. 