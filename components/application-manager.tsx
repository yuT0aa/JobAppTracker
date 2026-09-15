"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Application = {
  id: string;
  role: string;
  location: string | null;
  status: string;
  updatedAt: string;
  company: { name: string };
};

const statuses = ["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];

export function ApplicationManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("updatedAt");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [form, setForm] = useState({ company: "", role: "", location: "", status: "SAVED" });

  const loadApplications = useCallback(async (nextPage = page) => {
    const params = new URLSearchParams({ page: String(nextPage), pageSize: "12", sort, direction: "desc" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    const response = await fetch(`/api/applications?${params}`);
    if (!response.ok) {
      setError("Sign in to manage applications.");
      return;
    }
    const result = await response.json();
    setApplications(result.data);
    setPageCount(result.pagination.pageCount);
  }, [page, search, sort, statusFilter]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  async function createApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Unable to create application.");
      return;
    }
    setForm({ company: "", role: "", location: "", status: "SAVED" });
    await loadApplications();
  }

  async function deleteApplication(id: string) {
    const response = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete application.");
      return;
    }

    setApplications((current) => current.filter((application) => application.id !== id));
  }

  async function moveApplication(status: string) {
    if (!draggedId) return;
    const response = await fetch(`/api/applications/${draggedId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (response.ok) await loadApplications();
    setDraggedId(null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createApplication} className="grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-5">
        <input required placeholder="Company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
        <input required placeholder="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
        <input placeholder="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm" />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="h-10 rounded-md border bg-background px-3 text-sm">
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add application</Button>
      </form>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row">
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search role or company..." className="h-10 flex-1 rounded-md border bg-background px-3 text-sm" />
        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="updatedAt">Recently updated</option><option value="createdAt">Newest</option><option value="company">Company</option><option value="role">Role</option><option value="status">Status</option></select>
        <Button asChild variant="outline"><a href="/api/export/applications">Export CSV</a></Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-3 xl:grid-cols-6">
        {statuses.map((status) => (
          <div key={status} onDragOver={(event) => event.preventDefault()} onDrop={() => void moveApplication(status)} className="min-h-64 min-w-64 rounded-xl border bg-card p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{status}</h2>
              <span className="rounded-full bg-secondary px-2 py-1 text-xs">{applications.filter((item) => item.status === status).length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Page {page} of {pageCount}</span>
              <div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button></div>
            </div>
            <div className="space-y-2">
              {applications.filter((application) => application.status === status).map((application) => (
                <div key={application.id} draggable onDragStart={() => setDraggedId(application.id)} className="cursor-grab rounded-lg border bg-background p-3 shadow-sm active:cursor-grabbing">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{application.role}</p>
                      <p className="text-xs text-muted-foreground">{application.company.name}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${application.role}`} onClick={() => void deleteApplication(application.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
