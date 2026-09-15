"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Contact = { id: string; name: string; email: string | null; role: string | null; company: { name: string } | null };

export function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [error, setError] = useState("");
  async function load() {
    const response = await fetch("/api/contacts");
    if (!response.ok) { setError("Sign in to manage contacts."); return; }
    setContacts(await response.json());
  }
  useEffect(() => { void load(); }, []);
  async function create(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setError("Unable to create contact."); return; }
    setForm({ name: "", email: "", role: "" }); await load();
  }
  return <div className="space-y-6">
    <form onSubmit={create} className="grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-4">
      <input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
      <input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
      <input placeholder="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
      <Button type="submit">Add contact</Button>
    </form>
    {error && <p className="text-sm text-destructive">{error}</p>}
    <div className="divide-y rounded-xl border bg-card">
      {contacts.length === 0 ? <p className="p-12 text-center text-sm text-muted-foreground">No contacts yet.</p> : contacts.map((contact) => <div key={contact.id} className="p-4"><p className="font-medium">{contact.name}</p><p className="text-sm text-muted-foreground">{[contact.role, contact.company?.name, contact.email].filter(Boolean).join(" · ")}</p></div>)}
    </div>
  </div>;
}
