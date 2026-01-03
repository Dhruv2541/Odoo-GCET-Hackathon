import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "employee" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employeeId: string;
  department?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (in production, this would be API calls)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@dayflow.com",
    name: "Alex Morgan",
    role: "admin",
    employeeId: "DFAM20250001",
    department: "Human Resources",
    position: "HR Manager",
  },
  {
    id: "2",
    email: "employee@dayflow.com",
    name: "Jordan Chen",
    role: "employee",
    employeeId: "DFJC20250002",
    department: "Engineering",
    position: "Software Developer",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("dayflow_user");
    const token = localStorage.getItem("dayflow_token");
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password.length >= 6) {
      const token = `mock_jwt_${Date.now()}`;
      localStorage.setItem("dayflow_token", token);
      localStorage.setItem("dayflow_user", JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate employee ID
    const initials = data.name.split(" ").map(n => n[0]).join("").toUpperCase();
    const year = new Date().getFullYear();
    const serial = String(MOCK_USERS.length + 1).padStart(4, "0");
    const employeeId = `DF${initials}${year}${serial}`;
    
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      name: data.name,
      role: data.role,
      employeeId,
    };
    
    const token = `mock_jwt_${Date.now()}`;
    localStorage.setItem("dayflow_token", token);
    localStorage.setItem("dayflow_user", JSON.stringify(newUser));
    setUser(newUser);
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem("dayflow_token");
    localStorage.removeItem("dayflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
