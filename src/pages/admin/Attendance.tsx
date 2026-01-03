import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";

// Mock attendance data for all employees
const mockAttendanceData = [
  { id: "1", name: "Jordan Chen", date: "2026-01-03", checkIn: "09:02", checkOut: "18:15", status: "present", hours: "9h 13m" },
  { id: "2", name: "Sarah Johnson", date: "2026-01-03", checkIn: "08:45", checkOut: "17:30", status: "present", hours: "8h 45m" },
  { id: "3", name: "Michael Brown", date: "2026-01-03", checkIn: "09:15", checkOut: null, status: "working", hours: "4h 30m" },
  { id: "4", name: "Emma Williams", date: "2026-01-03", checkIn: null, checkOut: null, status: "absent", hours: "-" },
  { id: "5", name: "David Lee", date: "2026-01-03", checkIn: null, checkOut: null, status: "leave", hours: "-" },
  { id: "6", name: "Lisa Anderson", date: "2026-01-03", checkIn: "08:30", checkOut: "17:00", status: "present", hours: "8h 30m" },
];

export default function AdminAttendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const prevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Add this export function
  const handleExportAttendance = () => {
    const csvContent = [
      ["Employee Name", "Date", "Check In", "Check Out", "Status", "Work Hours"],
      ...mockAttendanceData.map(record => [
        record.name,
        record.date,
        record.checkIn || "N/A",
        record.checkOut || "N/A",
        record.status.charAt(0).toUpperCase() + record.status.slice(1),
        record.hours
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const formattedDate = currentDate.toISOString().split('T')[0];
    link.download = `attendance_${formattedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert(`Attendance data for ${currentDate.toLocaleDateString()} exported successfully!`);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      present: "bg-success/10 text-success",
      working: "bg-primary/10 text-primary",
      absent: "bg-destructive/10 text-destructive",
      leave: "bg-warning/20 text-warning-foreground",
    };
    return styles[status as keyof typeof styles] || styles.present;
  };

  const filteredData = mockAttendanceData.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summary = {
    present: mockAttendanceData.filter(a => a.status === "present" || a.status === "working").length,
    absent: mockAttendanceData.filter(a => a.status === "absent").length,
    onLeave: mockAttendanceData.filter(a => a.status === "leave").length,
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-foreground">Attendance</h1>
        <Button variant="outline" onClick={handleExportAttendance}> {/* Add onClick */}
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevDay}>
            <ChevronLeft size={16} />
          </Button>
          <span className="text-lg font-medium text-foreground min-w-[180px] text-center">
            {currentDate.toLocaleDateString("en-US", { 
              weekday: "long",
              month: "long", 
              day: "numeric",
              year: "numeric"
            })}
          </span>
          <Button variant="outline" size="icon" onClick={nextDay}>
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium text-success">{summary.present}</span> present
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-destructive">{summary.absent}</span> absent
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-warning-foreground">{summary.onLeave}</span> on leave
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="working">Working</option>
          <option value="absent">Absent</option>
          <option value="leave">On Leave</option>
        </select>
      </div>

      {/* Attendance Table */}
      <div className="dayflow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Check In</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Check Out</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Work Hours</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr 
                  key={record.id} 
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {record.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{record.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{record.checkIn || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{record.checkOut || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{record.hours}</span>
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
    </DashboardLayout>
  );
}
