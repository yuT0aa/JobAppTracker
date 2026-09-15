import Link from "next/link";
import { Bell, BriefcaseBusiness, Building2, CalendarDays, CheckSquare, Contact, FileText, LayoutDashboard, LineChart, Settings2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/contacts", label: "Contacts", icon: Contact },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/notifications", label: "Notifications", icon: Bell }
  ,{ href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function Navigation() {
  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="rounded-lg bg-primary p-2 text-primary-foreground">
            <BriefcaseBusiness className="h-4 w-4" />
          </span>
          CareerTrack
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Button key={href} asChild variant="ghost" className="gap-2" aria-label={label}>
              <Link href={href}>
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </Button>
          ))}
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings2 className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
