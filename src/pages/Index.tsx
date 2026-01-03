import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-foreground">Dayflow</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-4 leading-tight">
            Where work finds<br />its rhythm
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            A calm, intuitive HR management system designed for humans. Track attendance, manage leaves, and handle payroll — without the noise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="xl" asChild>
              <Link to="/signup">
                Start your flow
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                <Clock size={20} className="text-accent-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Attendance</p>
              <p className="text-xs text-muted-foreground mt-1">Simple check-in/out</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                <Calendar size={20} className="text-accent-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Time Off</p>
              <p className="text-xs text-muted-foreground mt-1">Request & approve</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                <Users size={20} className="text-accent-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Team</p>
              <p className="text-xs text-muted-foreground mt-1">Manage employees</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          Dayflow — No noise. No pressure. Just flow.
        </p>
      </footer>
    </div>
  );
};

export default Index;
