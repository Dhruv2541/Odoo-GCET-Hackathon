import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, Clock, Calendar, DollarSign, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react"; // Add this import

// Mock data for admin dashboard
const mockStats = {
  totalEmployees: 47,
  presentToday: 42,
  onLeave: 3,
  pendingLeaves: 5,
};

const mockPendingLeaves = [
  { id: 1, name: "Sarah Johnson", type: "Paid Time Off", days: 3, startDate: "Jan 5" },
  { id: 2, name: "Michael Chen", type: "Sick Leave", days: 1, startDate: "Jan 3" },
  { id: 3, name: "Emma Williams", type: "Paid Time Off", days: 5, startDate: "Jan 8" },
];

const mockRecentActivity = [
  { id: 1, type: "leave_request", user: "Sarah Johnson", time: "10 min ago" },
  { id: 2, type: "checkin", user: "David Brown", time: "15 min ago" },
  { id: 3, type: "new_employee", user: "Lisa Anderson", time: "1 hour ago" },
  { id: 4, type: "leave_approved", user: "Tom Wilson", time: "2 hours ago" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pendingLeaves, setPendingLeaves] = useState(mockPendingLeaves); // Add this state

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Add this function
  const handleLeaveAction = async (leaveId, action) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/leaves/${leaveId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: action,
          adminComment: action === 'approved' ? 'Leave approved' : 'Leave rejected'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update leave status');
      }

      const result = await response.json();
      console.log('Leave updated:', result);
      
      // Remove the approved/rejected leave from the list
      setPendingLeaves(prev => prev.filter(leave => leave.id !== leaveId));
      
      alert(`Leave ${action} successfully!`);
      
    } catch (error) {
      console.error('Error updating leave:', error);
      alert('Failed to update leave status');
    }
  };

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-foreground mb-1">
          {getGreeting()}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">Here's what's happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Employees"
          value={mockStats.totalEmployees}
          icon={Users}
          trend="+2 this month"
        />
        <StatCard
          label="Present Today"
          value={mockStats.presentToday}
          icon={Clock}
          trend={`${Math.round((mockStats.presentToday / mockStats.totalEmployees) * 100)}% attendance`}
          highlight
        />
        <StatCard
          label="On Leave"
          value={mockStats.onLeave}
          icon={Calendar}
          trend="Today"
        />
        <StatCard
          label="Pending Requests"
          value={mockStats.pendingLeaves}
          icon={AlertCircle}
          trend="Needs attention"
          alert
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <div className="dayflow-card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Pending Leave Requests</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/leaves" className="flex items-center gap-1 group">
                View all
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {pendingLeaves.length > 0 ? ( // Change from mockPendingLeaves to pendingLeaves
            <div className="space-y-3">
              {pendingLeaves.map((leave) => (
                <div 
                  key={leave.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{leave.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.type} • {leave.days} day{leave.days > 1 ? "s" : ""} from {leave.startDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => handleLeaveAction(leave.id, 'rejected')} // Add onClick
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleLeaveAction(leave.id, 'approved')} // Add onClick
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No pending requests
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dayflow-card p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {mockRecentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "leave_request" ? "bg-warning" :
                    activity.type === "checkin" ? "bg-success" :
                    activity.type === "new_employee" ? "bg-primary" :
                    "bg-muted-foreground"
                  }`} />
                  <div>
                    <span className="text-sm text-foreground">{activity.user}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {activity.type === "leave_request" && "requested leave"}
                      {activity.type === "checkin" && "checked in"}
                      {activity.type === "new_employee" && "joined the team"}
                      {activity.type === "leave_approved" && "leave approved"}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction
          label="Add Employee"
          icon={Users}
          href="/admin/employees"
        />
        <QuickAction
          label="View Attendance"
          icon={Clock}
          href="/admin/attendance"
        />
        <QuickAction
          label="Manage Leaves"
          icon={Calendar}
          href="/admin/leaves"
        />
        <QuickAction
          label="Payroll"
          icon={DollarSign}
          href="/admin/payroll"
        />
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon,
  trend,
  highlight,
  alert,
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
  trend?: string;
  highlight?: boolean;
  alert?: boolean;
}) {
  return (
    <div className={`dayflow-card p-4 ${highlight ? "border-success/30" : ""} ${alert ? "border-warning/30" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon size={14} className={
          highlight ? "text-success" : 
          alert ? "text-warning" : 
          "text-muted-foreground"
        } />
      </div>
      <p className="text-2xl font-medium text-foreground mb-0.5">{value}</p>
      {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}

function QuickAction({ 
  label, 
  icon: Icon, 
  href 
}: { 
  label: string; 
  icon: React.ElementType; 
  href: string; 
}) {
  return (
    <Link 
      to={href}
      className="dayflow-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
        <Icon size={18} className="text-accent-foreground" />
      </div>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </Link>
  );
}
