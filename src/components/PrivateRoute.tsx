import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "../security/AuthService";
import MenuBar from "./MenuBar";
import { useImageContext } from "../context/ImageContext";

let imageUrl =
  "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww";

// Define a component that checks for user authentication and redirects if needed
const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const { imageUrl, setImageUrl } = useImageContext();

  return AuthService.getCurrentUserToken() ? (
    <>
      <MenuBar img={imageUrl} notifications={Number(2)}></MenuBar>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
