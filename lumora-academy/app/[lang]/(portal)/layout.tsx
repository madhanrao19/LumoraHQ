"use client";

// Client-side auth guard: redirects to /login if there's no logged-in user.
// ponytail: this is a v1 shortcut, not a real access boundary — the page's
// data still briefly renders/fetches before the redirect fires, and a user
// can flash-see this shell. The robust follow-up is server-side/middleware
// (Next.js "proxy") protection reading a real session, not a client check.
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../../lib/auth-context";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${lang}/login`);
    }
  }, [loading, user, lang, router]);

  if (loading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center p-8 text-zinc-500">
        Loading…
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-4 text-sm">
          <Link href={`/${lang}/subjects`} className="font-semibold">
            Lumora Academy
          </Link>
          <Link href={`/${lang}/subjects`} className="hover:underline">
            Subjects
          </Link>
          {user.role === "parent" && (
            <Link href={`/${lang}/students`} className="hover:underline">
              My students
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            {user.name} ({user.role})
          </span>
          <button
            type="button"
            onClick={() => {
              logout().then(() => router.push(`/${lang}/login`));
            }}
            className="rounded border border-zinc-300 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </div>
      </nav>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
