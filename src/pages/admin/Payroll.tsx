import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Pencil, DollarSign } from "lucide-react";

// Mock payroll data for employees
const mockPayrollData = [
  { 
    id: "1", 
    name: "Jordan Chen", 
    employeeId: "DFJC20250002",
    department: "Engineering",
    basicSalary: 2500,
    allowances: 2750,
    deductions: 500,
    netPay: 4750,
  },
  { 
    id: "2", 
    name: "Sarah Johnson", 
    employeeId: "DFSJ20250003",
    department: "Marketing",
    basicSalary: 2800,
    allowances: 2200,
    deductions: 550,
    netPay: 4450,
  },
  { 
    id: "3", 
    name: "Michael Brown", 
    employeeId: "DFMB20250004",
    department: "Engineering",
    basicSalary: 3200,
    allowances: 2800,
    deductions: 650,
    netPay: 5350,
  },
  { 
    id: "4", 
    name: "Emma Williams", 
    employeeId: "DFEW20250005",
    department: "Design",
    basicSalary: 2600,
    allowances: 2400,
    deductions: 520,
    netPay: 4480,
  },
  { 
    id: "5", 
    name: "David Lee", 
    employeeId: "DFDL20250006",
    department: "Engineering",
    basicSalary: 2900,
    allowances: 2500,
    deductions: 580,
    netPay: 4820,
  },
];

export default function AdminPayroll() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [payrollData, setPayrollData] = useState(mockPayrollData); // Add state for data

  const departments = ["all", "Engineering", "Marketing", "Design", "HR"];

  const filteredData = payrollData.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === "all" || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPayroll = filteredData.reduce((sum, emp) => sum + emp.netPay, 0);

  // Add these functions
  const handleExport = () => {
    const csvContent = [
      ["Name", "Employee ID", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay"],
      ...payrollData.map(emp => [
        emp.name,
        emp.employeeId,
        emp.department,
        emp.basicSalary,
        emp.allowances,
        emp.deductions,
        emp.netPay
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert("Payroll data exported successfully as CSV!");
  };

  const handleRunPayroll = () => {
    // In a real app, this would call an API to process payroll
    // For now, we'll just show a confirmation
    const confirmed = window.confirm(
      `Run payroll for ${payrollData.length} employees? Total amount: ${formatCurrency(totalPayroll)}`
    );
    
    if (confirmed) {
      alert("Payroll processing started! Employees will be paid shortly.");
      // Here you would typically make an API call to process payroll
      // Example: await fetch('/api/payroll/run', { method: 'POST' });
    }
  };

  const handleEdit = (employeeId: string) => {
    // In a real app, this would open an edit modal or navigate to edit page
    alert(`Edit payroll for employee ID: ${employeeId}\n\nIn a real application, this would open an edit form.`);
    
    // Example implementation for edit modal:
    // const employee = payrollData.find(emp => emp.id === employeeId);
    // if (employee) {
    //   setEditingEmployee(employee);
    //   setIsEditModalOpen(true);
    // }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-foreground">Payroll</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}> {/* Add onClick */}
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button onClick={handleRunPayroll}> {/* Add onClick */}
            <DollarSign size={16} className="mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="dayflow-card-elevated p-4 md:col-span-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Payroll (This Month)</p>
          <p className="text-3xl font-serif text-primary">{formatCurrency(totalPayroll)}</p>
          <p className="text-sm text-muted-foreground mt-1">{filteredData.length} employees</p>
        </div>
        <div className="dayflow-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Avg. Salary</p>
          <p className="text-2xl font-medium text-foreground">
            {formatCurrency(Math.round(totalPayroll / filteredData.length))}
          </p>
        </div>
        <div className="dayflow-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
          <p className="text-lg font-medium text-success">Processed</p>
          <p className="text-xs text-muted-foreground">Jan 1, 2026</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or ID..."
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

      {/* Payroll Table */}
      <div className="dayflow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Basic</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Allowances</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Deductions</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Net Pay</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{employee.department}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-foreground">{formatCurrency(employee.basicSalary)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-success">{formatCurrency(employee.allowances)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-destructive">-{formatCurrency(employee.deductions)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium text-foreground">{formatCurrency(employee.netPay)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(employee.id)} // Add onClick
                    >
                      <Pencil size={14} />
                    </Button>
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
