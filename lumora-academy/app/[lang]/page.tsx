import Link from "next/link";

// English-only launch (ADR-0014) — hardcoded "/en" matches the plain
// redirect already used in app/page.tsx, rather than reading `params`.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Lumora Academy</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Student and parent portal.
      </p>
      <div className="flex gap-4 text-sm">
        <Link href="/en/login" className="underline">
          Log in
        </Link>
        <Link href="/en/register" className="underline">
          Register
        </Link>
        <Link href="/en/subjects" className="underline">
          Browse subjects
        </Link>
      </div>
    </main>
  );
}
