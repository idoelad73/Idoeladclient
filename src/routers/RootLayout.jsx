import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const go = params.get("go");

    const allowedRoutes = ["login"];

    if (go && allowedRoutes.includes(go)) {
      navigate(`/${go}`, { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
}
