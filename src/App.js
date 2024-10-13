import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import "./assets/scss/App.css";

const App = () => {
  return (
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;