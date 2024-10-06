import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "../layouts/loader/Loader";

const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const LoginPage = lazy(() => import("../components/auth/LoginPage"));
const Projects = lazy(() => import("../components/projects/ProjectList/ProjectList"));

// Import other components as needed

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<FullLayout />}>
          <Route path="projects" element={<Projects />} />
          {/* Add other routes as needed */}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;