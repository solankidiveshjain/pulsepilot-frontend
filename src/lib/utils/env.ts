/**
 * Get an environment variable with appropriate error handling
 * @param key - The environment variable key
 * @param defaultValue - Optional default value
 * @param required - Whether the variable is required
 */
export const getEnv = (
  key: string,
  defaultValue: string = "",
  required: boolean = false
): string => {
  const value = process.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not provided.`);
  }
  
  return value;
};

/**
 * Get a public environment variable (NEXT_PUBLIC_*)
 * @param key - The environment variable key (without NEXT_PUBLIC_ prefix)
 * @param defaultValue - Optional default value
 * @param required - Whether the variable is required
 */
export const getPublicEnv = (
  key: string,
  defaultValue: string = "",
  required: boolean = false
): string => {
  return getEnv(`NEXT_PUBLIC_${key}`, defaultValue, required);
};

/**
 * Parse a boolean environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default value if not found
 */
export const getBoolEnv = (
  key: string,
  defaultValue: boolean = false
): boolean => {
  const value = getEnv(key, String(defaultValue));
  return value === "true" || value === "1";
};

/**
 * Parse a public boolean environment variable
 * @param key - The environment variable key (without NEXT_PUBLIC_ prefix)
 * @param defaultValue - Default value if not found
 */
export const getPublicBoolEnv = (
  key: string,
  defaultValue: boolean = false
): boolean => {
  return getBoolEnv(`NEXT_PUBLIC_${key}`, defaultValue);
};

/**
 * Feature flag utility to check if a feature is enabled
 * @param feature - The feature name
 * @param defaultValue - Default value if not found
 */
export const isFeatureEnabled = (
  feature: string,
  defaultValue: boolean = false
): boolean => {
  return getPublicBoolEnv(`FEATURE_${feature}`, defaultValue);
}; 