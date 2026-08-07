import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: "80px 20px", textAlign: "center" }}>Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ marginBottom: 12 }}>Admins Only</h2>
        <p style={{ opacity: 0.7, fontFamily: "Helvetica, Arial, sans-serif" }}>
          This account ({user.email}) doesn't have admin access. Add it to
          VITE_ADMIN_EMAILS in your .env to grant access.
        </p>
      </div>
    );
  }

  return children;
}
