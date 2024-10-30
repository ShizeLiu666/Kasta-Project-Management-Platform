// import { lazy } from "react";
// import { Navigate } from "react-router-dom";
// import { createBrowserRouter } from "react-router-dom";

// /****Layouts*****/
// const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

// /***** Pages ****/
// const LoginPage = lazy(() => import("../components/auth/LoginPage"));
// const Projects = lazy(() => import("../components/projects/ProjectList/ProjectList"));
// const Profile = lazy(() => import("../components/profile/profile"));
// const AuthCodeManagement = lazy(() => import("../components/AuthCodeManagement/AuthCodeManagement"));

// // const Form = lazy(() => import("../views/ui/Form.js"));
// // const About = lazy(() => import("../views/About.js"));
// // const Alerts = lazy(() => import("../views/ui/Alerts"));
// // const Badges = lazy(() => import("../views/ui/Badges"));
// // const Buttons = lazy(() => import("../views/ui/Buttons"));
// // const Grid = lazy(() => import("../views/ui/Grid"));
// // const Tables = lazy(() => import("../views/ui/Tables"));
// // const ExcelConverter = lazy(() => import("../components/fileConverter/ExcelConverter"));
// // const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

// /*****Routes******/
// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <LoginPage />,
//   },
//   {
//     path: "/",
//     element: <Navigate to="/login" />,
//   },
//   {
//     path: "/admin",
//     element: <FullLayout />,
//     children: [
//       { path: "projects", element: <Projects /> },
//       { path: "profile", element: <Profile /> },
//       { path: "auth-code-management", element: <AuthCodeManagement /> },
//       // { path: "about", element: <About /> },
//       // { path: "alerts", element: <Alerts /> },
//       // { path: "badges", element: <Badges /> },
//       // { path: "buttons", element: <Buttons /> },
//       // { path: "grid", element: <Grid /> },
//       // { path: "table", element: <Tables /> },
//       // { path: "excelconverter", element: <ExcelConverter /> },
//       // { path: "breadcrumbs", element: <Breadcrumbs /> },
//       // { path: "forms", element: <Form /> },
//     ],
//   },
//   {
//     path: "*",
//     element: <Navigate to="/login" />,
//   },
// ]);

// export default router;

import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

/****Layouts*****/
import FullLayout from "../layouts/FullLayout.js";

/***** Pages ****/
import LoginPage from "../components/Login/LoginPage";
import ProjectListComponent from "../components/projects/ProjectList/ProjectListComponent";
import Profile from "../components/profile/profile";
import AuthCodeManagement from "../components/AuthCodeManagement/AuthCodeManagement";
import TestComponent from "../components/Testing/TestComponent";

/*****Routes******/
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/admin",
    element: <FullLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/projects" /> },
      { path: "projects", element: <ProjectListComponent /> },
      { path: "profile", element: <Profile /> },
      { path: "auth-code-management", element: <AuthCodeManagement /> },
      { path: "testing", element: <TestComponent /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);

export default router;
