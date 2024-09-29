import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import "./assets/scss/App.css";
// import { ExcelConverterProvider } from './components/fileConverter/ExcelConverterContext';

const AppRoutes = () => {
  const routing = useRoutes(ThemeRoutes);
  return routing;
};

const App = () => {
  return (
    <Router>
      <div className="dark">
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;