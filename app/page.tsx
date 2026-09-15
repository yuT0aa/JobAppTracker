import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Your job search, organized</p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Move from applying to hired with clarity.</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Keep every opportunity, interview, and follow-up in one calm, focused workspace.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild size="lg">
          <Link href="/dashboard">Open dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
      <div className="mt-16 grid gap-3 text-left sm:grid-cols-3">
        {["Track every application", "Never miss a follow-up", "See your momentum"].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-lg border bg-card p-4 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
          </div>
        ))}
      </div>
    </section>
  );
}
