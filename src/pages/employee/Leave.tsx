import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Calendar, Check, Clock } from "lucide-react";

// Mock leave data
const mockLeaveBalance = {
  paidTimeOff: { total: 24, used: 12, available: 12 },
  sickLeave: { total: 7, used: 0, available: 7 },
};

const mockLeaveHistory = [
  { 
    id: 1, 
    type: "Paid Time Off", 
    startDate: "2025-12-25", 
    endDate: "2025-12-25", 
    days: 1, 
    status: "approved",
    reason: "Holiday travel",
    adminComment: null,
  },
  { 
    id: 2, 
    type: "Paid Time Off", 
    startDate: "2026-01-05", 
    endDate: "2026-01-07", 
    days: 3, 
    status: "pending",
    reason: "Family event",
    adminComment: null,
  },
  { 
    id: 3, 
    type: "Sick Leave", 
    startDate: "2025-11-15", 
    endDate: "2025-11-15", 
    days: 1, 
    status: "approved",
    reason: "Not feeling well",
    adminComment: null,
  },
];

export default function EmployeeLeave() {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: "Paid Time Off",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaveHistory, setLeaveHistory] = useState(mockLeaveHistory); // Add state for leave history

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate days between start and end date
    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    
    // Create new leave request
    const newLeaveRequest = {
      id: leaveHistory.length + 1,
      type: newLeave.type,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days: days,
      status: "pending",
      reason: newLeave.reason,
      adminComment: null,
    };
    
    // Update leave balance based on type
    const leaveType = newLeave.type === "Paid Time Off" ? "paidTimeOff" : "sickLeave";
    
    // In a real app, you would make an API call here
    // Example: await fetch('/api/leaves', { method: 'POST', body: JSON.stringify(newLeaveRequest) });
    
    // Add to leave history
    setLeaveHistory([newLeaveRequest, ...leaveHistory]);
    
    // Show success message
    alert(`Leave request submitted successfully!\n\nType: ${newLeave.type}\nDuration: ${days} day${days > 1 ? 's' : ''}\nFrom: ${newLeave.startDate} to ${newLeave.endDate}`);
    
    // Reset form
    setShowNewRequest(false);
    setNewLeave({ type: "Paid Time Off", startDate: "", endDate: "", reason: "" });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-success/10", text: "text-success", icon: Check };
      case "pending":
        return { bg: "bg-warning/20", text: "text-warning-foreground", icon: Clock };
      case "rejected":
        return { bg: "bg-destructive/10", text: "text-destructive", icon: X };
      default:
        return { bg: "bg-muted", text: "text-muted-foreground", icon: Clock };
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif text-foreground">Time Off</h1>
          <Button onClick={() => setShowNewRequest(true)}>
            <Plus size={16} className="mr-2" />
            New Request
          </Button>
        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="dayflow-card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Paid Time Off</h3>
              <Calendar size={18} className="text-primary" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-medium text-foreground">
                  {mockLeaveBalance.paidTimeOff.available}
                </p>
                <p className="text-sm text-muted-foreground">Days available</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {mockLeaveBalance.paidTimeOff.used} of {mockLeaveBalance.paidTimeOff.total} used
              </p>
            </div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${(mockLeaveBalance.paidTimeOff.used / mockLeaveBalance.paidTimeOff.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="dayflow-card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Sick Leave</h3>
              <Calendar size={18} className="text-accent-foreground" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-medium text-foreground">
                  {mockLeaveBalance.sickLeave.available}
                </p>
                <p className="text-sm text-muted-foreground">Days available</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {mockLeaveBalance.sickLeave.used} of {mockLeaveBalance.sickLeave.total} used
              </p>
            </div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-foreground transition-all" 
                style={{ width: `${(mockLeaveBalance.sickLeave.used / mockLeaveBalance.sickLeave.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* New Request Form */}
        {showNewRequest && (
          <div className="dayflow-card-elevated p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">New Leave Request</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowNewRequest(false)}>
                <X size={18} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Leave Type</Label>
                  <select 
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                    className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>Paid Time Off</option>
                    <option>Sick Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input 
                    type="date" 
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input 
                    type="date" 
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Reason</Label>
                <Textarea 
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Brief description of your leave request..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewRequest(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </div>
        )}

        {/* Leave History */}
        <div className="dayflow-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Leave History</h3>
          </div>

          <div className="divide-y divide-border">
            {leaveHistory.map((leave) => { // Change from mockLeaveHistory to leaveHistory
              const statusStyle = getStatusStyles(leave.status);
              const StatusIcon = statusStyle.icon;

              return (
                <div key={leave.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{leave.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
                          <StatusIcon size={12} />
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {leave.startDate !== leave.endDate && ` - ${new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        {" · "}{leave.days} day{leave.days > 1 ? "s" : ""}
                      </p>
                      {leave.reason && (
                        <p className="text-sm text-muted-foreground">{leave.reason}</p>
                      )}
                      {leave.adminComment && (
                        <p className="text-sm text-destructive mt-2">
                          Admin: {leave.adminComment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
