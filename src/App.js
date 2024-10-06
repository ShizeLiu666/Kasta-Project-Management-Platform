import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import "./assets/scss/App.css";

const App = () => {
  useEffect(() => {
    const isFirstLoad = sessionStorage.getItem('isFirstLoad') !== 'false';
    if (isFirstLoad) {
      sessionStorage.setItem('isFirstLoad', 'false');
      window.location.reload();
    }
  }, []);

  return (
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;