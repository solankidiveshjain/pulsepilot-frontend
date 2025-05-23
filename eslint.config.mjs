import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  // Ignore Next.js build output
  { ignores: ['**/.next/**'] },
  // Next.js core web vitals config
  ...compat.extends('next/core-web-vitals'),
  // You can add more flat config entries or overrides below
];

export default config;
