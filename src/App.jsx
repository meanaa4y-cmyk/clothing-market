import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import StorePage from "./pages/StorePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
