import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  Component: React.FC;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  Component,
}) => {
  const { authState, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }
  console.log(authState);
  return authState.accessToken ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
