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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostPage from "./pages/PostPage/PostPage";

let client = new QueryClient();

const Router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "/", element:<ProtectedRoute> <Home /></ProtectedRoute> },
      { path: "/home", element:<ProtectedRoute> <Home /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute> <Profile /></ProtectedRoute> },
      { path: "/post/:id", element: <ProtectedRoute> <PostPage /></ProtectedRoute> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
]);

function App() {
  
  return (
    <>
    <AuthContext>

      <QueryClientProvider client={client}>

        <Toast.Provider placement="top" />
        
        <RouterProvider router={Router} />

      </QueryClientProvider>

    </AuthContext>
    </>
  );
}

export default App;
