import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SyncLoader from "react-spinners/SyncLoader";
import Logo from "./AppLogo";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-orange-gradient">
        <div className="mb-4">
          <Logo />
        </div>

        <SyncLoader color="#c16135"/>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
