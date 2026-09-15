"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocumentItem = { id: string; name: string; kind: string; url: string };

export function DocumentManager() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [form, setForm] = useState({ name: "", url: "", kind: "RESUME" });
  const [error, setError] = useState("");
  async function load() {
    const response = await fetch("/api/documents");
    if (!response.ok) { setError("Sign in to manage documents."); return; }
    setDocuments(await response.json());
  }
  useEffect(() => { void load(); }, []);
  async function create(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setError("Enter a name and valid URL."); return; }
    setForm({ name: "", url: "", kind: "RESUME" }); await load();
  }
  async function remove(id: string) {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments((items) => items.filter((item) => item.id !== id));
  }
  return (
    <div className="space-y-6">
      <form onSubmit={create} className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-4">
        <input required placeholder="Document name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
        <input required type="url" placeholder="https://..." value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
        <select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm">{["RESUME", "COVER_LETTER", "PORTFOLIO", "OTHER"].map((kind) => <option key={kind}>{kind}</option>)}</select>
        <Button type="submit">Add document</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 ? <p className="col-span-full rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">No documents yet.</p> : documents.map((document) => (
          <div key={document.id} className="flex items-start justify-between rounded-xl border bg-card p-4">
            <a href={document.url} target="_blank" rel="noreferrer" className="flex gap-3"><FileText className="h-5 w-5 text-primary" /><span><span className="block font-medium">{document.name}</span><span className="text-xs text-muted-foreground">{document.kind}</span></span></a>
            <Button variant="ghost" size="icon" aria-label={`Delete ${document.name}`} onClick={() => void remove(document.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
