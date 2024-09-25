import React, { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import "./assets/scss/App.css";

const AppRoutes = () => {
  const routing = useRoutes(ThemeRoutes);
  return routing;
};

const App = () => {
  return (
    <Router basename="/"> {/* 如果您的应用部署在子目录，请相应修改 basename */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="dark">
          <AppRoutes />
        </div>
      </Suspense>
    </Router>
  );
};

export default App;
