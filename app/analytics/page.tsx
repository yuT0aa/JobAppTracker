import { AnalyticsView } from "@/components/analytics-view";
export default function AnalyticsPage() { return <div><p className="text-sm text-muted-foreground">Insights</p><h1 className="text-3xl font-bold tracking-tight">Analytics</h1><p className="mt-2 text-muted-foreground">Understand your pipeline and where your effort is going.</p><div className="mt-8"><AnalyticsView /></div></div>; }
