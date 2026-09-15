import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return <div><p className="text-sm text-muted-foreground">Administration</p><h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1><p className="mt-2 text-muted-foreground">Manage access and monitor platform activity.</p><div className="mt-8"><AdminDashboard /></div></div>;
}
