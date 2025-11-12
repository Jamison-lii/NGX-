import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useModal } from "./ModalContext";
import { useEffect, useState } from "react";
import Login from "../Components/Login/Login";// your modal component

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { showModal } = useModal();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!user) {
      showModal(<Login />); // trigger modal AFTER render
      setRedirect(true);          // trigger redirect
    }
  }, [user, showModal]); // ✅ dependencies stable

  if (redirect === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
