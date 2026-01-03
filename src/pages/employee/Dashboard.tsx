import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import

// Mock attendance data
const mockRecentActivity = [
  { id: 1, type: "checkin", time: "09:02 AM", date: "Today" },
  { id: 2, type: "checkout", time: "06:15 PM", date: "Yesterday" },
  { id: 3, type: "leave_approved", time: "02:30 PM", date: "Dec 30" },
  { id: 4, type: "checkin", time: "08:55 AM", date: "Dec 30" },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this hook
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Add this function for navigation
  const handleViewProfile = () => {
    navigate("/employee/profile"); // Adjust this path based on your routing
  };

  const handleCheckInOut = () => {
    const now = new Date().toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
    
    if (isCheckedIn) {
      setLastAction(`Checked out at ${now}`);
    } else {
      setLastAction(`Checked in at ${now}`);
    }
    setIsCheckedIn(!isCheckedIn);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-foreground mb-1">
          {getGreeting()}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">Today's flow</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Check In/Out Card */}
        <div className="dayflow-card-elevated p-6 col-span-1 md:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-1">Attendance</h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: "long",
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isCheckedIn 
                ? "bg-success/10 text-success" 
                : "bg-muted text-muted-foreground"
            }`}>
              {isCheckedIn ? "Working" : "Not checked in"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="xl"
              variant={isCheckedIn ? "outline" : "default"}
              onClick={handleCheckInOut}
              className="min-w-[160px]"
            >
              <Clock size={18} />
              {isCheckedIn ? "Check out" : "Check in"}
            </Button>
            
            {lastAction && (
              <p className="text-sm text-muted-foreground animate-fade-in">
                {lastAction}
              </p>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="dayflow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.employeeId}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between group"
            onClick={handleViewProfile} // Add onClick
          >
            View Profile
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="This Week"
          value="38h 45m"
          subtext="Working hours"
          icon={Clock}
        />
        <StatCard
          label="Leave Balance"
          value="12"
          subtext="Days available"
          icon={Calendar}
        />
        <StatCard
          label="This Month"
          value="21"
          subtext="Days present"
          icon={CheckCircle}
        />
        <StatCard
          label="Pending"
          value="1"
          subtext="Leave request"
          icon={Calendar}
        />
      </div>

      {/* Recent Activity */}
      <div className="dayflow-card p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {mockRecentActivity.map((activity, index) => (
            <div 
              key={activity.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "checkin" ? "bg-success" :
                  activity.type === "checkout" ? "bg-muted-foreground" :
                  "bg-primary"
                }`} />
                <span className="text-sm text-foreground">
                  {activity.type === "checkin" && "Checked in"}
                  {activity.type === "checkout" && "Checked out"}
                  {activity.type === "leave_approved" && "Leave approved"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{activity.time}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  label, 
  value, 
  subtext, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  subtext: string; 
  icon: React.ElementType;
}) {
  return (
    <div className="dayflow-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <p className="text-2xl font-medium text-foreground mb-0.5">{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
