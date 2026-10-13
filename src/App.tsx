import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toast } from "@heroui/react";
import AuthContext from "./context/AuthContext";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/guard/Guard";


const Router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "/", element:<ProtectedRoute> <Home /></ProtectedRoute> },
      { path: "/home", element:<ProtectedRoute> <Home /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute> <Profile /></ProtectedRoute> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
]);
function App() {
  
  return (
    <>
      <AuthContext>
        <Toast.Provider placement="top" />
        <RouterProvider router={Router} />
      </AuthContext>
    </>
  );
}

export default App;
