import { CalendarView } from "@/components/calendar-view";
export default function CalendarPage() { return <div><p className="text-sm text-muted-foreground">Schedule</p><h1 className="text-3xl font-bold tracking-tight">Calendar</h1><p className="mt-2 text-muted-foreground">Interviews, reminders, and due tasks in one view.</p><div className="mt-8"><CalendarView /></div></div>; }
