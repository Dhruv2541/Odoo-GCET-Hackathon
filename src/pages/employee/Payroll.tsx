import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, DollarSign } from "lucide-react";

// Mock payroll data
const mockPayrollData = {
  month: "January 2026",
  basic: 2500,
  hra: 1250,
  standardAllowance: 625,
  performanceBonus: 625,
  leaveTravel: 250,
  grossSalary: 5250,
  employeePF: 300,
  professionalTax: 200,
  totalDeductions: 500,
  netPay: 4750,
  workingDays: 22,
  daysWorked: 21,
  paidDays: 21,
};

export default function EmployeePayroll() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif text-foreground">Payroll</h1>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Download Slip
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 mb-6">
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

        {/* Net Pay Highlight */}
        <div className="dayflow-card-elevated p-8 mb-6 text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Net Pay</p>
          <p className="text-4xl font-serif text-primary mb-2">
            {formatCurrency(mockPayrollData.netPay)}
          </p>
          <p className="text-sm text-muted-foreground">
            For {mockPayrollData.paidDays} days worked
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="dayflow-card">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <DollarSign size={16} className="text-success" />
              <h3 className="font-medium text-foreground">Earnings</h3>
            </div>
            <div className="p-4 space-y-3">
              <PayrollRow label="Basic Salary" amount={mockPayrollData.basic} percent={50} />
              <PayrollRow label="House Rent Allowance" amount={mockPayrollData.hra} percent={25} />
              <PayrollRow label="Standard Allowance" amount={mockPayrollData.standardAllowance} percent={12.5} />
              <PayrollRow label="Performance Bonus" amount={mockPayrollData.performanceBonus} percent={12.5} />
              <PayrollRow label="Leave Travel Allowance" amount={mockPayrollData.leaveTravel} />
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Gross Salary</span>
                  <span className="font-medium text-foreground">{formatCurrency(mockPayrollData.grossSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="dayflow-card">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <DollarSign size={16} className="text-destructive" />
              <h3 className="font-medium text-foreground">Deductions</h3>
            </div>
            <div className="p-4 space-y-3">
              <PayrollRow label="Employee PF" amount={mockPayrollData.employeePF} percent={12} isDeduction />
              <PayrollRow label="Professional Tax" amount={mockPayrollData.professionalTax} isDeduction />
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total Deductions</span>
                  <span className="font-medium text-destructive">-{formatCurrency(mockPayrollData.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Working Days</span>
                  <span className="text-foreground">{mockPayrollData.workingDays}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days Worked</span>
                  <span className="text-foreground">{mockPayrollData.daysWorked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid Days</span>
                  <span className="text-foreground">{mockPayrollData.paidDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          For any discrepancies, please contact the HR department.
        </p>
      </div>
    </DashboardLayout>
  );
}

function PayrollRow({ 
  label, 
  amount, 
  percent, 
  isDeduction 
}: { 
  label: string; 
  amount: number; 
  percent?: number; 
  isDeduction?: boolean;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isDeduction ? "text-destructive" : "text-foreground"}`}>
          {isDeduction ? "-" : ""}{formatCurrency(amount)}
        </span>
        {percent && (
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {percent}%
          </span>
        )}
      </div>
    </div>
  );
}
