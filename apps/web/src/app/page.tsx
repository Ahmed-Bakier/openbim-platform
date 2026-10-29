import { SystemStatus } from "@/components/system-status";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">OpenBIM Platform</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          BIM issue management and collaboration based on the buildingSMART BCF standard.
        </p>
      </header>
      <SystemStatus />
    </main>
  );
}
