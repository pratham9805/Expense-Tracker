import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

// function Dashboard() {
//   return (
//     <button
//   onClick={() => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   }}
//   className="mt-4 bg-red-600 px-4 py-2 rounded"
// >
//   Logout
// </button>

//   );
// }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
