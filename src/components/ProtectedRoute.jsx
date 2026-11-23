
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 font-medium">
          Verifying your session...
        </p>
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "resident") {
      return <Navigate to="/dashboard" replace />;
    }

    
    return <Navigate to="/" replace />;
  }

  return children;
}
