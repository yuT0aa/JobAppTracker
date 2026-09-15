import { CompanyManager } from "@/components/company-manager";

export default function CompaniesPage() {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Directory</p>
      <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
      <p className="mt-2 text-muted-foreground">Keep company details reusable across your applications.</p>
      <div className="mt-8"><CompanyManager /></div>
    </div>
  );
}
