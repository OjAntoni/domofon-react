import React, { ReactNode } from "react";
import { Navigate, useLocation, RouteProps } from "react-router-dom";
import { Outlet } from "react-router-dom";

interface PublicRouteProps {
  // Define any additional props you need, such as a redirect path
  redirectTo: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ redirectTo }) => {
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  if (isLoggedIn) {
    // Redirect to the specified path if the user is logged in
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children (Outlet) if not logged in
  return <Outlet />;
};

export default PublicRoute;
