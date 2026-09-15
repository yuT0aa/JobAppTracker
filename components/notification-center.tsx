"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationItem = { id: string; title: string; message: string; readAt: string | null };

export function NotificationCenter() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  useEffect(() => { fetch("/api/notifications").then(async (response) => { if (response.ok) setItems(await response.json()); }); }, []);
  async function markRead(item: NotificationItem) {
    await fetch(`/api/notifications/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, readAt: new Date().toISOString() } : entry));
  }
  return <div className="space-y-3">{items.length === 0 ? <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground"><Bell className="mx-auto mb-2 h-5 w-5" />You&apos;re all caught up.</div> : items.map((item) => <div key={item.id} className={`flex items-start justify-between gap-4 rounded-xl border bg-card p-4 ${item.readAt ? "opacity-60" : ""}`}><div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.message}</p></div>{!item.readAt && <Button variant="ghost" size="icon" aria-label="Mark as read" onClick={() => void markRead(item)}><Check className="h-4 w-4" /></Button>}</div>)}</div>;
}
