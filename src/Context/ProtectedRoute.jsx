import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {

  const { user, loading } = useAuth();

  console.log("Current user:", user);

 if (loading) {
  return <div className="p-6">Loading...</div>;
}

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;