import "@testing-library/jest-dom";
import { expect } from "vitest";
// import * as matchers from 'jest-axe/matchers'; // Deprecated way
import { axe, toHaveNoViolations } from "jest-axe"; // Import axe and the matcher

// Extend Vitest's expect with jest-axe matchers
// expect.extend(matchers); // Deprecated way
expect.extend({ toHaveNoViolations }); // Recommended way

// Optional: Configure axe default options
// axe.configure({
//   rules: {
//     // Example: disable a specific rule globally if needed, though it's better to fix violations
//     // 'region': { enabled: false },
//   },
// });

// Re-export axe for easy import in test files if desired, or import directly from 'jest-axe'
export { axe };
