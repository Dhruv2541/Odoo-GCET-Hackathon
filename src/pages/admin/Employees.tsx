import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Eye, MoreVertical } from "lucide-react";

// Mock employee data
const mockEmployees = [
  { id: "1", name: "Jordan Chen", employeeId: "DFJC20250002", email: "jordan@dayflow.com", department: "Engineering", position: "Software Developer", status: "active" },
  { id: "2", name: "Sarah Johnson", employeeId: "DFSJ20250003", email: "sarah@dayflow.com", department: "Marketing", position: "Marketing Manager", status: "active" },
  { id: "3", name: "Michael Brown", employeeId: "DFMB20250004", email: "michael@dayflow.com", department: "Engineering", position: "Senior Developer", status: "active" },
  { id: "4", name: "Emma Williams", employeeId: "DFEW20250005", email: "emma@dayflow.com", department: "Design", position: "UI Designer", status: "active" },
  { id: "5", name: "David Lee", employeeId: "DFDL20250006", email: "david@dayflow.com", department: "Engineering", position: "DevOps Engineer", status: "on_leave" },
  { id: "6", name: "Lisa Anderson", employeeId: "DFLA20250007", email: "lisa@dayflow.com", department: "HR", position: "HR Specialist", status: "active" },
];

export default function AdminEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [employees, setEmployees] = useState(mockEmployees); // Add state

  const departments = ["all", "Engineering", "Marketing", "Design", "HR", "Finance"];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === "all" || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // Add these functions
  const handleAddEmployee = () => {
    const newEmployeeId = `DF${new Date().getFullYear()}${String(employees.length + 1).padStart(4, '0')}`;
    const newEmployee = {
      id: String(employees.length + 1),
      name: `New Employee ${employees.length + 1}`,
      employeeId: newEmployeeId,
      email: `newemployee${employees.length + 1}@dayflow.com`,
      department: "Engineering",
      position: "New Position",
      status: "active"
    };
    
    setEmployees([...employees, newEmployee]);
    alert(`New employee added with ID: ${newEmployeeId}\n\nIn a real application, this would open a form to add employee details.`);
  };

  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      alert(`View Employee Details:\n\nName: ${employee.name}\nEmployee ID: ${employee.employeeId}\nEmail: ${employee.email}\nDepartment: ${employee.department}\nPosition: ${employee.position}\nStatus: ${employee.status}\n\nIn a real application, this would open a detailed view page.`);
    }
  };

  const handleEditEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      alert(`Edit Employee: ${employee.name}\n\nIn a real application, this would open an edit form for employee ID: ${employee.employeeId}`);
    }
  };

  const handleMoreActions = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const action = prompt(
        `Additional actions for ${employee.name}:\n\nEnter action:\n1. Change Status\n2. Generate Report\n3. Send Email\n4. Other`
      );
      if (action) {
        alert(`Action "${action}" selected for ${employee.name}`);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-foreground">Employees</h1>
        <Button onClick={handleAddEmployee}> {/* Add onClick */}
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[150px]"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "all" ? "All Departments" : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <div className="dayflow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Employee ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Position</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground font-mono">{employee.employeeId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{employee.department}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">{employee.position}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === "active" 
                        ? "bg-success/10 text-success" 
                        : "bg-warning/20 text-warning-foreground"
                    }`}>
                      {employee.status === "active" ? "Active" : "On Leave"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewEmployee(employee.id)} // Add onClick
                      >
                        <Eye size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditEmployee(employee.id)} // Add onClick
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleMoreActions(employee.id)} // Add onClick
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees {/* Change to employees.length */}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
