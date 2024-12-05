import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import "./assets/scss/App.css";
import emailjs from '@emailjs/browser';

// 初始化 EmailJS
emailjs.init("f2rwMdAOQ3bS3Jo6j");  // 使用你的 Public Key

const App = () => {
  return (
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;