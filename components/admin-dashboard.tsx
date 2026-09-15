"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type AdminData = {
  totals: { users: number; applications: number; companies: number; interviews: number };
  users: { id: string; name: string | null; email: string | null; role: "USER" | "ADMIN"; createdAt: string; _count: { applications: number } }[];
};

export function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  async function load() {
    const response = await fetch("/api/admin");
    if (!response.ok) { setError(response.status === 403 ? "Administrator access required." : "Sign in to view the admin dashboard."); return; }
    setData(await response.json());
  }
  useEffect(() => { void load(); }, []);
  async function changeRole(id: string, role: "USER" | "ADMIN") {
    const response = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    if (!response.ok) { setError("Unable to update role."); return; }
    await load();
  }
  if (error) return <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Loading admin metrics...</p>;
  return <div className="space-y-8">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(data.totals).map(([label, value]) => <div key={label} className="rounded-xl border bg-card p-5"><p className="text-sm capitalize text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}</div>
    <div className="overflow-x-auto rounded-xl border bg-card"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b text-muted-foreground"><tr><th className="p-4 font-medium">User</th><th className="p-4 font-medium">Applications</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Action</th></tr></thead><tbody className="divide-y">{data.users.map((user) => <tr key={user.id}><td className="p-4"><p className="font-medium">{user.name || "Unnamed user"}</p><p className="text-muted-foreground">{user.email || "No email"}</p></td><td className="p-4">{user._count.applications}</td><td className="p-4"><span className="rounded-full bg-secondary px-2 py-1 text-xs">{user.role}</span></td><td className="p-4"><Button variant="outline" size="sm" onClick={() => void changeRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}>{user.role === "ADMIN" ? "Demote" : "Promote"}</Button></td></tr>)}</tbody></table></div>
  </div>;
}
