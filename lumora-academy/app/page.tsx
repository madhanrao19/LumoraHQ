import { redirect } from "next/navigation";

// English-only launch (ADR-0014) — only one locale exists, so this is a
// plain redirect rather than Accept-Language negotiation.
export default function RootPage() {
  redirect("/en");
}
