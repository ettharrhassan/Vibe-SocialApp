import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toast } from "@heroui/react";

const Router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [{ path: "/home", element: <Home /> }],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
]);
function App() {
 
  
  return (
    <>
      <Toast.Provider placement="top" />
      <RouterProvider router={Router} />
    </>
  );
}

export default App;


