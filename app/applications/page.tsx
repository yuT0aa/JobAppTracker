import { ApplicationManager } from "@/components/application-manager";

export default function ApplicationsPage() {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Pipeline</p>
      <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
      <p className="mt-2 text-muted-foreground">Track every opportunity from saved to hired.</p>
      <div className="mt-8"><ApplicationManager /></div>
    </div>
  );
}
