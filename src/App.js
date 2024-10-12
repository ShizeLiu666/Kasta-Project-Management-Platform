import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import "./assets/scss/App.css";

const App = () => {
  return (
    <div className="dark">
      <Suspense fallback={<div>加载中...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

export default App;
