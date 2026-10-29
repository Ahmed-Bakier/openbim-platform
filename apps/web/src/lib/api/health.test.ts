import { describe, expect, it, vi } from "vitest";

import { ApiUnreachableError, fetchReadiness } from "./health";

const BASE = "http://api.test/api/v1";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchReadiness", () => {
  it("returns the readiness payload when all checks pass", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ status: "ok", checks: { database: "ok" } }));

    await expect(fetchReadiness(BASE, fetchImpl)).resolves.toEqual({
      status: "ok",
      checks: { database: "ok" },
    });
    expect(fetchImpl).toHaveBeenCalledWith(`${BASE}/health/ready`, expect.any(Object));
  });

  it("treats 503 as a valid 'unavailable' answer, not an error", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        jsonResponse({ status: "unavailable", checks: { database: "error" } }, 503),
      );

    await expect(fetchReadiness(BASE, fetchImpl)).resolves.toEqual({
      status: "unavailable",
      checks: { database: "error" },
    });
  });

  it("throws ApiUnreachableError on network failure", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchReadiness(BASE, fetchImpl)).rejects.toBeInstanceOf(ApiUnreachableError);
  });

  it("throws on unexpected HTTP status", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("nope", { status: 500 }));

    await expect(fetchReadiness(BASE, fetchImpl)).rejects.toThrow("HTTP 500");
  });

  it("throws when the body does not match the contract", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ status: "maybe" }));

    await expect(fetchReadiness(BASE, fetchImpl)).rejects.toThrow("unexpected health response");
  });
});
