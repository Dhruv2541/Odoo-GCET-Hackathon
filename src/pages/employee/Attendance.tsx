import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock attendance data
const mockAttendance = [
  { date: "2026-01-03", checkIn: "09:02", checkOut: "18:15", status: "present", hours: "9h 13m" },
  { date: "2026-01-02", checkIn: "08:55", checkOut: "18:00", status: "present", hours: "9h 05m" },
  { date: "2026-01-01", checkIn: null, checkOut: null, status: "holiday", hours: "-" },
  { date: "2025-12-31", checkIn: null, checkOut: null, status: "holiday", hours: "-" },
  { date: "2025-12-30", checkIn: "09:10", checkOut: "17:45", status: "present", hours: "8h 35m" },
  { date: "2025-12-29", checkIn: null, checkOut: null, status: "weekend", hours: "-" },
  { date: "2025-12-28", checkIn: null, checkOut: null, status: "weekend", hours: "-" },
  { date: "2025-12-27", checkIn: "09:00", checkOut: "18:30", status: "present", hours: "9h 30m" },
  { date: "2025-12-26", checkIn: "08:45", checkOut: "17:30", status: "present", hours: "8h 45m" },
  { date: "2025-12-25", checkIn: null, checkOut: null, status: "leave", hours: "-" },
];

export default function EmployeeAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      present: "bg-success/10 text-success",
      absent: "bg-destructive/10 text-destructive",
      leave: "bg-primary/10 text-primary",
      holiday: "bg-muted text-muted-foreground",
      weekend: "bg-muted text-muted-foreground",
    };
    return styles[status as keyof typeof styles] || styles.present;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  // Calculate summary
  const summary = {
    present: mockAttendance.filter(a => a.status === "present").length,
    absent: mockAttendance.filter(a => a.status === "absent").length,
    leave: mockAttendance.filter(a => a.status === "leave").length,
    totalHours: "45h 08m",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-serif text-foreground mb-6">Attendance</h1>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-lg font-medium text-foreground min-w-[150px] text-center">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{summary.present}</span> days present
            </span>
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{summary.totalHours}</span> total
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard label="Present" value={summary.present} color="success" />
          <SummaryCard label="Absent" value={summary.absent} color="destructive" />
          <SummaryCard label="On Leave" value={summary.leave} color="primary" />
          <SummaryCard label="Total Hours" value={summary.totalHours} />
        </div>

        {/* Attendance Table */}
        <div className="dayflow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Check In</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Check Out</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Work Hours</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.map((record, index) => (
                  <tr 
                    key={record.date} 
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-foreground">
                        {formatDate(record.date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                        {record.checkIn || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                        {record.checkOut || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                        {record.hours}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  const colorClass = {
    success: "text-success",
    destructive: "text-destructive",
    primary: "text-primary",
  };

  return (
    <div className="dayflow-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-medium ${color ? colorClass[color as keyof typeof colorClass] : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
