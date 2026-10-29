/**
 * Public runtime configuration.
 * NEXT_PUBLIC_* values are inlined into the browser bundle at build time — never put secrets here.
 */
export const apiBaseUrl: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
