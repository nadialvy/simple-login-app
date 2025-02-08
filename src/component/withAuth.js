import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function WithAuth(Component) {
  function ComponentWithAuth() {
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    console.log(token);

    useEffect(() => {
      if (!token) {
        console.log("Redirecting to /login because token is missing...");
        navigate("/login");
      }
    }, [navigate, token]);

    // Allow access to /login even if not authenticated
    if (location.pathname === "/login") {
      return <Component />;
    }

    try {
      // Check if token is expired
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid Token:", error);
      navigate("/login");
    }

    // If authenticated, render the component
    return <Component />;
  }

  return ComponentWithAuth;
}
