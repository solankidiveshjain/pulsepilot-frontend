# Component Versioning Guidelines

## Recent Cleanup

On May 15, 2025, the V2 components were consolidated into the main components. Previously, the codebase contained:

- `CommentCard.tsx` and `CommentCardV2.tsx`
- `ReplyThread.tsx` and `ReplyThreadV2.tsx`

These have been consolidated to a single version of each component:

- `CommentCard.tsx`
- `ReplyThread.tsx`

A backup of the original files was preserved in the `backup-components-*` directory in case reference is needed.

## Component Versioning Policy

For future component development:

1. **Avoid versioned filenames**:

   - Instead of creating new versions with suffixes (e.g., V2, V3), prefer to evolve existing components
   - Use feature flags or props to toggle new behaviors when needed

2. **For major rewrites**:

   - Create the new component in a separate branch
   - Use a descriptive name based on its purpose, not a version number
   - Replace the old component entirely once tested and approved

3. **Temporary coexistence**:

   - If two versions must temporarily coexist (e.g., during gradual migration), use a naming convention based on functionality or approach rather than numeric versioning
   - Example: `CommentCardLegacy` and `CommentCard` instead of `CommentCardV1` and `CommentCardV2`
   - Set a timeline for complete migration and removal of legacy components

4. **Documentation**:
   - Document significant component changes in component files
   - Use the changelog to track component evolution
   - Update Storybook with examples of new components or features

By following these guidelines, we maintain a cleaner codebase, avoid confusion, and ensure components are properly documented and maintained.
