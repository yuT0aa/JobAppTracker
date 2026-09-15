"use client";

import { useEffect, useState } from "react";

type Analytics = { byStatus: Record<string, number>; byMonth: { month: string; count: number }[]; topCompanies: { name: string; count: number }[] };

export function AnalyticsView() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/analytics").then(async (response) => { if (!response.ok) { setError("Sign in to view analytics."); return; } setData(await response.json()); }).catch(() => setError("Unable to load analytics.")); }, []);
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Loading analytics...</p>;
  const total = Object.values(data.byStatus).reduce((sum, value) => sum + value, 0);
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Total tracked</p><p className="mt-2 text-3xl font-bold">{total}</p></div><div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Interviews</p><p className="mt-2 text-3xl font-bold">{data.byStatus.INTERVIEW ?? 0}</p></div><div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Offers</p><p className="mt-2 text-3xl font-bold">{data.byStatus.OFFER ?? 0}</p></div></div><div className="grid gap-6 lg:grid-cols-2"><div className="rounded-xl border bg-card p-5"><h2 className="font-semibold">Pipeline by status</h2><div className="mt-4 space-y-3">{Object.entries(data.byStatus).map(([status, count]) => <div key={status}><div className="mb-1 flex justify-between text-sm"><span>{status}</span><span>{count}</span></div><div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${total ? count / total * 100 : 0}%` }} /></div></div>)}</div></div><div className="rounded-xl border bg-card p-5"><h2 className="font-semibold">Top companies</h2><div className="mt-4 space-y-3">{data.topCompanies.length ? data.topCompanies.map((company) => <div key={company.name} className="flex justify-between text-sm"><span>{company.name}</span><span className="font-medium">{company.count}</span></div>) : <p className="text-sm text-muted-foreground">Add applications to see trends.</p>}</div></div></div></div>;
}
