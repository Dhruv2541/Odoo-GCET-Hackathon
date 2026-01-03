import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock leave requests
const mockLeaveRequests = [
  { 
    id: 1, 
    employee: "Sarah Johnson",
    employeeId: "DFSJ20250003",
    type: "Paid Time Off", 
    startDate: "2026-01-05", 
    endDate: "2026-01-07", 
    days: 3, 
    status: "pending",
    reason: "Family event",
    requestedAt: "2026-01-02",
  },
  { 
    id: 2, 
    employee: "Michael Chen",
    employeeId: "DFMC20250008",
    type: "Sick Leave", 
    startDate: "2026-01-03", 
    endDate: "2026-01-03", 
    days: 1, 
    status: "pending",
    reason: "Medical appointment",
    requestedAt: "2026-01-02",
  },
  { 
    id: 3, 
    employee: "Emma Williams",
    employeeId: "DFEW20250005",
    type: "Paid Time Off", 
    startDate: "2026-01-08", 
    endDate: "2026-01-12", 
    days: 5, 
    status: "pending",
    reason: "Vacation",
    requestedAt: "2026-01-01",
  },
  { 
    id: 4, 
    employee: "Jordan Chen",
    employeeId: "DFJC20250002",
    type: "Paid Time Off", 
    startDate: "2025-12-25", 
    endDate: "2025-12-25", 
    days: 1, 
    status: "approved",
    reason: "Holiday travel",
    requestedAt: "2025-12-20",
  },
  { 
    id: 5, 
    employee: "David Lee",
    employeeId: "DFDL20250006",
    type: "Sick Leave", 
    startDate: "2025-12-15", 
    endDate: "2025-12-16", 
    days: 2, 
    status: "rejected",
    reason: "Unwell",
    requestedAt: "2025-12-14",
    adminComment: "Insufficient sick leave balance",
  },
];

export default function AdminLeaves() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests); // Add this line

  const filteredRequests = leaveRequests.filter((req) => { // Change mockLeaveRequests to leaveRequests
    const matchesSearch = req.employee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter(r => r.status === "pending");
  const otherRequests = filteredRequests.filter(r => r.status !== "pending");

  const handleApprove = (id: number) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'approved' } : req
      )
    );
    console.log("Approved:", id);
    alert(`Leave request approved successfully!`);
  };

  const handleReject = (id: number) => {
    if (!rejectComment.trim()) return;
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id ? { 
          ...req, 
          status: 'rejected',
          adminComment: rejectComment 
        } : req
      )
    );
    console.log("Rejected:", id, "Comment:", rejectComment);
    setRejectingId(null);
    setRejectComment("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/20 text-warning-foreground";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-foreground">Leave Requests</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 bg-warning/20 text-warning-foreground rounded">
            {leaveRequests.filter(r => r.status === "pending").length} pending // Change mockLeaveRequests to leaveRequests
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="dayflow-card-elevated p-4 animate-fade-in">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-medium text-primary">
                        {request.employee.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{request.employee}</h3>
                        <span className="text-xs text-muted-foreground">{request.employeeId}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-xs">
                          {request.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(request.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {request.startDate !== request.endDate && ` - ${new Date(request.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {request.days} day{request.days > 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                  </div>

                  {rejectingId === request.id ? (
                    <div className="flex flex-col gap-2 min-w-[250px]">
                      <Textarea
                        placeholder="Reason for rejection..."
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setRejectingId(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                          disabled={!rejectComment.trim()}
                          className="flex-1"
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setRejectingId(request.id)}
                      >
                        <X size={14} className="mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check size={14} className="mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Requests */}
      {otherRequests.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">History</h2>
          <div className="dayflow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Employee</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dates</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Days</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {otherRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {request.employee.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{request.employee}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{request.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {request.startDate !== request.endDate && ` - ${new Date(request.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{request.days}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
