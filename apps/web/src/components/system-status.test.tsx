import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SystemStatus } from "./system-status";

function renderWithQueryClient() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SystemStatus />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("SystemStatus", () => {
  it("shows API online and database connected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: "ok", checks: { database: "ok" } }), {
          status: 200,
        }),
      ),
    );

    renderWithQueryClient();

    expect(await screen.findByText("Online")).toBeTruthy();
    expect(screen.getByText("Connected")).toBeTruthy();
  });

  it("shows database unavailable when the API reports 503", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: "unavailable", checks: { database: "error" } }), {
          status: 503,
        }),
      ),
    );

    renderWithQueryClient();

    expect(await screen.findByText("Unavailable")).toBeTruthy();
    expect(screen.getByText("Online")).toBeTruthy();
  });

  it("shows an alert when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    renderWithQueryClient();

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByText("Unreachable")).toBeTruthy();
  });
});
