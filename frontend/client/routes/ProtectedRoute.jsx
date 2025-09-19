import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/AuthContext";

export default function ProtectedRoute({ role, children }) {
  // keep generated import path, but use loading check like yours
  const { user, loading = false } = useUser();

  if (loading) return <p>Loading...</p>; // replace with spinner component if you have one

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
