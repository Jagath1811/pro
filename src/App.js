import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Dashboard from "./pages/Dashboard.js";
import Profile from "./pages/Profile.js";
import Workouts from "./pages/Workouts.js";
import DietPlans from "./pages/DietPlans.js";
import SleepTracker from "./pages/SleepTracker.js";
import Analytics from "./pages/Analytics.js";
import Layout from "./components/Layout.js";
import ErrorBoundary from "./components/ErrorBoundary.js";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="diet-plans" element={<DietPlans />} />
        <Route path="sleep" element={<SleepTracker />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
