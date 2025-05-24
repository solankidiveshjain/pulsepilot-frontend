import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from 'jest-axe/matchers';
import { axe } from 'jest-axe'; // Import axe itself for use in tests

// Extend Vitest's expect with jest-axe matchers
expect.extend(matchers);

// Optional: Configure axe default options
// axe.configure({
//   rules: {
//     // Example: disable a specific rule globally if needed, though it's better to fix violations
//     // 'region': { enabled: false }, 
//   },
// });

// Re-export axe for easy import in test files if desired, or import directly from 'jest-axe'
export { axe };
