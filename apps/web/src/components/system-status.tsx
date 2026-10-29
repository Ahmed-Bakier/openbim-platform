"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchReadiness } from "@/lib/api/health";
import { apiBaseUrl } from "@/lib/config";

type Tone = "ok" | "error" | "pending";

const toneClasses: Record<Tone, string> = {
  ok: "bg-emerald-500",
  error: "bg-red-500",
  pending: "bg-zinc-400 animate-pulse",
};

function StatusRow({ label, tone, text }: { label: string; tone: Tone; text: string }) {
  return (
    <li className="flex items-center justify-between gap-6 py-2">
      <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
      <span className="flex items-center gap-2 font-medium">
        <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${toneClasses[tone]}`} />
        {text}
      </span>
    </li>
  );
}

export function SystemStatus() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["health", "ready"],
    queryFn: ({ signal }) => fetchReadiness(apiBaseUrl, fetch, signal),
  });

  const apiRow: { tone: Tone; text: string } = isPending
    ? { tone: "pending", text: "Checking…" }
    : isError
      ? { tone: "error", text: "Unreachable" }
      : { tone: "ok", text: "Online" };

  const database = data?.checks.database;
  const dbRow: { tone: Tone; text: string } = isPending
    ? { tone: "pending", text: "Checking…" }
    : database === "ok"
      ? { tone: "ok", text: "Connected" }
      : database === "error"
        ? { tone: "error", text: "Unavailable" }
        : { tone: "error", text: "Unknown" };

  return (
    <section
      aria-labelledby="system-status-heading"
      className="w-full rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between">
        <h2 id="system-status-heading" className="text-base font-semibold">
          System status
        </h2>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {isFetching ? "Checking…" : "Recheck"}
        </button>
      </div>
      <ul className="mt-3 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <StatusRow label="Backend API" {...apiRow} />
        <StatusRow label="Database" {...dbRow} />
      </ul>
      {isError && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          Could not reach the API at <code>{apiBaseUrl}</code>. Is it running? (
          <code>make api</code>)
        </p>
      )}
    </section>
  );
}
