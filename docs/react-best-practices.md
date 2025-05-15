# React Best Practices for PulsePilot Frontend

## Tools for Structural Validation and Preventing Rendering Issues

### 1. Static Analysis Tools

- **ESLint with React-specific Rules**

  - Install `eslint-plugin-react` and `eslint-plugin-react-hooks`
  - Configure exhaustive-deps rule to catch dependency array issues
  - Example config:
    ```json
    {
      "plugins": ["react", "react-hooks"],
      "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
      ],
      "rules": {
        "react-hooks/exhaustive-deps": "error"
      }
    }
    ```

- **TypeScript with Strict Mode**
  - Enable `strict: true` in tsconfig.json
  - Use explicit return types for complex functions
  - Define interfaces for all component props

### 2. Runtime Debugging Tools

- **React DevTools**

  - Use the Profiler to identify unnecessary re-renders
  - Check component tree for unexpected nesting

- **why-did-you-render**

  - Setup:

    ```javascript
    // In src/wdyr.ts
    import React from "react";

    if (process.env.NODE_ENV === "development") {
      const whyDidYouRender = require("@welldone-software/why-did-you-render");
      whyDidYouRender(React, {
        trackAllPureComponents: true,
      });
    }
    ```

  - Import at the top of your app entry point
  - Track specific components:
    ```javascript
    MyComponent.whyDidYouRender = true;
    ```

### 3. Testing Infrastructure

- **Component Test Coverage**

  - Use Jest and React Testing Library
  - Test all component rendering states: loading, error, success
  - Verify proper DOM structure
  - Test user interactions and state changes
  - Test with mock data that matches production schema exactly

- **Storybook for Visual Regression Testing**
  - Create stories for all component variants
  - Use addon-a11y for accessibility checks
  - Implement visual regression tests with Chromatic

### 4. Performance Monitoring

- **Use React.memo for Pure Components**

  ```javascript
  export const MyComponent = memo(function MyComponent(props) {
    // component code
  });
  ```

- **React.useCallback and React.useMemo for Expensive Operations**

  ```javascript
  const memoizedCallback = useCallback(() => {
    doSomethingWithDeps(a, b);
  }, [a, b]);

  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

- **Use Web Vitals API to Measure User Experience**

  ```javascript
  import { getCLS, getFID, getLCP } from "web-vitals";

  function sendToAnalytics({ name, delta, id }) {
    // Send metrics to analytics
  }

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  ```

### 5. Virtualization Best Practices

- **Prefer Simple Solutions Over Complex Ones**

  - Use pagination first if applicable
  - Only virtualize lists with more than 50-100 items

- **Fixed Size Lists Are More Stable Than Variable Size**

  - Use FixedSizeList where possible
  - If using VariableSizeList, implement robust measurement

- **Proper List Item Structure**

  - Keep DOM structure simple
  - Avoid nested scrollable areas in virtualized lists
  - Ensure proper event propagation
  - Ensure dynamic content (like replies) is properly contained within parent elements

- **Cache Size Measurements**
  - Use memoization for size calculations
  - Implement a size cache for variable lists
- **Dynamically Expanding Content**

  - Consider replacing virtualization with pagination
  - Or implement custom expand/collapse without virtualization
  - For nested expandable content, use fixed containers with internal scrolling
  - Follow this pattern for expandable content:

  ```javascript
  // Preferred approach for expandable content
  function ExpandableComponent({ isExpanded, children }) {
    return (
      <div className="relative">
        {isExpanded && <div className="max-h-[200px] overflow-y-auto">{children}</div>}
      </div>
    );
  }
  ```

### 6. React 19 Compatibility

- **Avoid Legacy Ref Patterns**

  ```javascript
  // BAD - will cause issues in React 19
  useImperativeHandle(ref, () => ({
    getNode: () => ref.current,
  }));

  // GOOD - forward refs properly
  const Component = forwardRef((props, ref) => {
    const internalRef = useRef(null);
    useImperativeHandle(ref, () => ({
      focus: () => internalRef.current?.focus(),
    }));
    return <div ref={internalRef} />;
  });
  ```

- **Prefer Function Components**

  - Convert all class components to function components
  - Use hooks instead of lifecycle methods
  - Avoid string refs completely

- **Strict Type Checking**
  - Never use `@ts-expect-error` or `any` to bypass type issues
  - Use proper typing for all refs and state

### 7. Common Patterns to Avoid

- **Circular Update Patterns**

  ```javascript
  // BAD
  const [height, setHeight] = useState(0);
  useEffect(() => {
    // This causes an infinite loop!
    setHeight(ref.current.offsetHeight);
  });

  // GOOD
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(ref.current.offsetHeight);
  }, []); // Empty dependency array
  ```

- **Multiple Sources of Truth**

  ```javascript
  // BAD
  const [isExpanded, setIsExpanded] = useState(false);
  // ...later in the component
  if (props.expandedIds.has(id)) {
    // Using both local state and props to determine expanded state
  }

  // GOOD
  // Only use props or derive state from props
  const isExpanded = props.expandedIds.has(id);
  ```

- **Event Propagation Issues**

  ```javascript
  // BAD
  <div onClick={handleParentClick}>
    <button onClick={handleButtonClick}>Click Me</button>
  </div>

  // GOOD
  <div onClick={handleParentClick}>
    <button onClick={(e) => {
      e.stopPropagation();
      handleButtonClick();
    }}>Click Me</button>
  </div>
  ```

- **Unsafe Optional Chaining**

  ```javascript
  // BAD - can cause "Cannot read properties of undefined" errors
  const value = data.deeply.nested.property;

  // GOOD - Use optional chaining
  const value = data?.deeply?.nested?.property;

  // BETTER - Add fallbacks for undefined values
  const value = data?.deeply?.nested?.property ?? defaultValue;
  ```

## Implementation Checklist

When implementing complex UI features, especially those with dynamic content or virtualization:

1. ✅ Start with a simple implementation and add complexity only as needed
2. ✅ Test with real data volumes similar to production
3. ✅ Test on lower-end devices to catch performance issues early
4. ✅ Profile component re-renders in React DevTools
5. ✅ Verify screen reader accessibility
6. ✅ Implement comprehensive unit and integration tests
7. ✅ Verify type safety throughout the component hierarchy
8. ✅ Test all edge cases, especially empty/null states

## For This Project Specifically

1. **Fix Current Issues**

   - Avoid using unnecessary z-index values
   - Fix border overlaps with proper margin/padding
   - Ensure data consistency between display and actual content
   - Prevent "Cannot read properties of undefined" errors with proper null checks
   - Ensure proper DOM containment for dynamic content

2. **Add Monitoring**

   - Implement why-did-you-render to catch unnecessary re-renders
   - Add comprehensive test coverage for all components
   - Set up visual regression testing with Storybook
   - Add runtime error monitoring in production

3. **Consider Alternatives to Virtualization**
   - For dynamic content like comments with replies, pagination might be more stable
   - If virtualization is necessary, prefer simpler fixed-height solutions
   - For expandable content within virtualized lists:
     - Use fixed containers with max-height and internal scrolling
     - Avoid dynamic height calculations during runtime
     - Ensure proper parent-child containment in the DOM
