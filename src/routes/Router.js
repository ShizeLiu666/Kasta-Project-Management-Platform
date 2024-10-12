import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/
const LoginPage = lazy(() => import("../components/auth/LoginPage"));
const Projects = lazy(() => import("../components/projects/ProjectList/ProjectList"));
const Profile = lazy(() => import("../components/profile/profile"));
const AuthCodeManagement = lazy(() => import("../components/AuthCodeManagement/AuthCodeManagement"));

/*****Routes******/
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <FullLayout />
      </Suspense>
    ),
    children: [
      {
        path: "projects",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Projects />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "auth-code-management",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <AuthCodeManagement />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);

export default router;
