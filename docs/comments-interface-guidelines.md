# PulsePilot Comments Interface Guidelines

These guidelines are mandatory for any development work on the comments interface. Any pull requests that don't follow these guidelines will be rejected.

## Architecture

- Maintain clean separation of concerns with a layered architecture:
  - UI components (pure presentational components)
  - Container components (handling data flow and operations)
  - State management (Zustand store with selectors for performance)
  - Models (data transformation and business logic)

## Component Structure

- All comments UI components must be in `src/components/comments/ui/`
- All containers must be in `src/components/comments/containers/`
- All state management must be in `src/components/comments/state/`
- All models must be in `src/components/comments/models/`

## Virtualization Requirements

- **Always use `react-window` for comment lists** (not react-virtualized)
- Implement proper dynamic size measurement for variable height comments
- Include handling for expanded thread states
- Test with both large datasets (1000+ comments) and small datasets (10-20 comments)
- Handle resize events appropriately to recalculate list dimensions

## Layout & Responsive Design

- Use the defined layout components that enforce the correct UI structure
- Follow the 12-column grid system for desktop layouts
- Implement stacked layouts for mobile views
- Use Tailwind responsive classes for all layout adjustments
- All padding/spacing must be handled inside components (no outer margins)
- Test interface at all breakpoints: mobile, tablet, and desktop

## Performance Optimizations

- Use memoization to prevent unnecessary re-renders:
  - `useMemo` for derived data
  - `useCallback` for event handlers
  - Zustand selectors for state access
- Implement proper loading states with skeletons
- Use virtualization for any list that might exceed 20 items
- Optimize re-renders by avoiding prop drilling and unnecessary state updates
- Use the React DevTools Profiler to identify and fix performance issues

## TypeScript & Type Safety

- All components must have explicit prop interfaces
- All state must be properly typed with discriminated unions for complex states
- Use proper null safety with optional chaining and nullish coalescing
- No use of `any` or `@ts-expect-error` to bypass type checking
- Define model types that match the backend API schema exactly

## State Management & Data Flow

- Use Zustand for global comments state
- Implement selective state updates to prevent unnecessary re-renders
- Follow the store/selector pattern for accessing state
- Keep derived state calculations in selectors, not components
- Use React Query for API data fetching and caching
- Implement optimistic updates for better user experience

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Use proper semantic HTML elements (buttons, lists, etc.)
- Include appropriate ARIA attributes where needed
- Ensure focus management works properly
- Test with screen readers
- Maintain proper color contrast (WCAG AA compliance)
- Support all standard accessibility features

## Error Handling

- Use error boundaries to prevent cascading failures
- Implement proper error states in the UI
- Log errors to monitoring services
- Provide user-friendly error messages
- Include retry mechanisms where appropriate

## Testing Requirements

- Unit tests for all utility functions and hooks
- Component tests for UI components
- Integration tests for key user flows
- Test all states: loading, error, empty, and data states
- Test both light and dark modes

These guidelines are mandatory and override any quick fix or workaround. All code reviews must enforce these standards.
