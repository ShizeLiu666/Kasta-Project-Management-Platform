import React, { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import ThemeRoutes from "./routes/Router";
import "./assets/scss/App.css";

const ErrorFallback = ({ error }) => (
  <div>
    <h1>error!</h1>
    <pre>{error.message}</pre>
  </div>
);

const AppRoutes = () => {
  const routing = useRoutes(ThemeRoutes);
  return routing;
};

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router basename="/"> {/* 如果您的应用部署在子目录，请相应修改 basename */}
        <Suspense fallback={<div>加载中...</div>}>
          <div className="dark">
            <AppRoutes />
          </div>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;