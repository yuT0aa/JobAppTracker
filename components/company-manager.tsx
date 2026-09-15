"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Company = { id: string; name: string; website: string | null; _count: { applications: number } };

export function CompanyManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/companies");
    if (!response.ok) {
      setError("Sign in to manage companies.");
      return;
    }
    setCompanies(await response.json());
  }

  useEffect(() => { void load(); }, []);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      setError("Unable to create company.");
      return;
    }
    setName("");
    await load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="flex gap-3 rounded-xl border bg-card p-5">
        <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Company name" className="h-10 flex-1 rounded-md border bg-background px-3 text-sm" />
        <Button type="submit">Add company</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="rounded-xl border bg-card">
        {companies.length === 0 ? <p className="p-12 text-center text-sm text-muted-foreground">No companies yet.</p> : (
          <div className="divide-y">
            {companies.map((company) => (
              <div key={company.id} className="flex justify-between p-4">
                <span className="font-medium">{company.name}</span>
                <span className="text-sm text-muted-foreground">{company._count.applications} applications</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
