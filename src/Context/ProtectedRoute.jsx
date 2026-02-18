import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useModal } from "./ModalContext";
import { useEffect } from "react";
import Login from "../Components/Login/Login";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { showModal, hideModal } = useModal();

  // If no user, show login modal then block access
  useEffect(() => {
    if (!user) {
      showModal(<Login />);
    }hideModal();
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
