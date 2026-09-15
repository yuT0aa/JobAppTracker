"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type CalendarData = { interviews: { id: string; scheduledAt: string; type: string; application: { role: string; company: { name: string } } }[]; reminders: { id: string; remindAt: string; title: string }[]; tasks: { id: string; dueAt: string | null; title: string }[] };
type Application = { id: string; role: string; company: { name: string } };

export function CalendarView() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationId, setApplicationId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  async function load() {
    const [calendarResponse, applicationsResponse] = await Promise.all([fetch("/api/calendar"), fetch("/api/applications")]);
    if (!calendarResponse.ok) { setError("Sign in to see your calendar."); return; }
    setData(await calendarResponse.json());
    if (applicationsResponse.ok) {
      const result = await applicationsResponse.json();
      setApplications(result.data ?? result);
    }
  }
  useEffect(() => { void load(); }, []);
  async function createInterview() {
    const response = await fetch("/api/interviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId, scheduledAt: new Date(scheduledAt).toISOString(), type: "VIDEO" }) });
    if (!response.ok) { setError("Select an application and a valid date."); return; }
    setScheduledAt(""); await load();
  }
  async function createReminder() {
    const response = await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId: applicationId || null, title, remindAt: new Date(scheduledAt).toISOString() }) });
    if (!response.ok) { setError("Enter a reminder and date."); return; }
    setTitle(""); setScheduledAt(""); await load();
  }
  const events = data ? [
    ...data.interviews.map((item) => ({ id: item.id, date: item.scheduledAt, label: `Interview: ${item.application.role} · ${item.application.company.name}` })),
    ...data.reminders.map((item) => ({ id: item.id, date: item.remindAt, label: `Reminder: ${item.title}` })),
    ...data.tasks.filter((item) => item.dueAt).map((item) => ({ id: item.id, date: item.dueAt as string, label: `Task: ${item.title}` }))
  ].sort((a, b) => a.date.localeCompare(b.date)) : [];
  return <div className="space-y-6">
    <div className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-4">
      <select value={applicationId} onChange={(event) => setApplicationId(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Application (optional for reminder)</option>{applications.map((application) => <option key={application.id} value={application.id}>{application.role} · {application.company.name}</option>)}</select>
      <input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm" />
      <input placeholder="Reminder title" value={title} onChange={(event) => setTitle(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm" />
      <div className="flex gap-2"><Button type="button" onClick={() => void createInterview()}>Add interview</Button><Button type="button" variant="outline" onClick={() => void createReminder()}>Add reminder</Button></div>
    </div>
    {error && <p className="text-sm text-destructive">{error}</p>}
    <div className="rounded-xl border bg-card p-6">{events.length === 0 ? <p className="text-sm text-muted-foreground">No scheduled events.</p> : <div className="space-y-3">{events.map((event) => <div key={event.id} className="flex gap-4 border-b pb-3 last:border-0"><time className="w-36 shrink-0 text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</time><span className="text-sm">{event.label}</span></div>)}</div>}</div>
  </div>;
}
