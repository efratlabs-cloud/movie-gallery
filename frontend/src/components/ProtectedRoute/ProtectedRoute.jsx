import { getToken } from "../../lib/token.js";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
if (!getToken()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
