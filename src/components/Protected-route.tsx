import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirect = "/",
}: Props) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;
  // If route is admin-only, only redirect when we explicitly know the user is NOT an admin.
  // This allows initial auth sync (where role may be undefined) to complete without forcing a redirect.
  if (adminOnly && admin === false) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
