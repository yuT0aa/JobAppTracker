"use client";

import { BriefcaseBusiness, Clock3, Send } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total applications", key: "total", icon: BriefcaseBusiness },
  { label: "In progress", key: "INTERVIEW", icon: Clock3 },
  { label: "Offers", key: "OFFER", icon: Send }
];

export default function DashboardPage() {
  const [data, setData] = useState<{ total: number; byStatus: Record<string, number> } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/dashboard").then(async (response) => {
      if (!response.ok) {
        setError("Sign in to see your dashboard.");
        return;
      }
      setData(await response.json());
    }).catch(() => setError("Unable to load dashboard."));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Overview</p>
        <h1 className="text-3xl font-bold tracking-tight">Good morning</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/applications">Manage applications</Link></Button>
        <Button asChild variant="outline"><Link href="/analytics">View analytics</Link></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, key, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-semibold">
              {data ? (key === "total" ? data.total : data.byStatus[key] ?? 0) : "—"}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-dashed bg-card p-12 text-center">
        <h2 className="font-semibold">{error || "Your job search starts here"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add your first application to begin building your pipeline.</p>
      </div>
    </div>
  );
}
