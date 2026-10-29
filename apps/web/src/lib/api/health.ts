import { z } from "zod";

const checkStatus = z.enum(["ok", "error"]);

export const readinessSchema = z.object({
  status: z.enum(["ok", "unavailable"]),
  checks: z.record(z.string(), checkStatus),
});

export type Readiness = z.infer<typeof readinessSchema>;

export class ApiUnreachableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ApiUnreachableError";
  }
}

/**
 * Calls GET /health/ready. A 503 is a valid answer (the API is up but a dependency is down),
 * so it resolves with `status: "unavailable"` instead of throwing.
 * Throws ApiUnreachableError when the API cannot be reached or answers unexpectedly.
 */
export async function fetchReadiness(
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
  signal?: AbortSignal,
): Promise<Readiness> {
  let response: Response;
  try {
    response = await fetchImpl(`${baseUrl}/health/ready`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
  } catch (cause) {
    throw new ApiUnreachableError("The API could not be reached.", { cause });
  }

  if (!response.ok && response.status !== 503) {
    throw new ApiUnreachableError(`The API answered with HTTP ${response.status}.`);
  }

  const parsed = readinessSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new ApiUnreachableError("The API returned an unexpected health response.");
  }
  return parsed.data;
}
