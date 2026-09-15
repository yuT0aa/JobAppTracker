"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Task = { id: string; title: string; dueAt: string | null; completedAt: string | null };

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  async function load() {
    const response = await fetch("/api/tasks");
    if (!response.ok) { setError("Sign in to manage tasks."); return; }
    setTasks(await response.json());
  }
  useEffect(() => { void load(); }, []);
  async function create(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    if (!response.ok) { setError("Unable to create task."); return; }
    setTitle(""); await load();
  }
  async function complete(task: Task) {
    await fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: !task.completedAt }) });
    await load();
  }
  return <div className="space-y-6">
    <form onSubmit={create} className="flex gap-3 rounded-xl border bg-card p-5">
      <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Follow up with recruiter" className="h-10 flex-1 rounded-md border bg-background px-3 text-sm" />
      <Button type="submit">Add task</Button>
    </form>
    {error && <p className="text-sm text-destructive">{error}</p>}
    <div className="divide-y rounded-xl border bg-card">
      {tasks.length === 0 ? <p className="p-12 text-center text-sm text-muted-foreground">No tasks yet.</p> : tasks.map((task) => <label key={task.id} className="flex items-center gap-3 p-4 text-sm"><input type="checkbox" checked={Boolean(task.completedAt)} onChange={() => void complete(task)} /><span className={task.completedAt ? "text-muted-foreground line-through" : ""}>{task.title}</span></label>)}
    </div>
  </div>;
}
