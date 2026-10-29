import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toast } from "@heroui/react";
import AuthContext from "./context/AuthContext";
import Profile from "./pages/profile/Profile";
import UserProfile from "./pages/profile/UserProfile";
import ProtectedRoute from "./components/guard/Guard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostPage from "./pages/PostPage/PostPage";
import SavedPost from "./components/Saved/SavedPost";
import LikedPosts from "./components/Liked/LikedPosts";
import SearchResults from "./components/SearchResults/SearchResults";
import FollowSuggestions from "./components/Follow/FollowSuggestions";

let client = new QueryClient();

const Router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "/", element:<ProtectedRoute> <Home /></ProtectedRoute> },
      { path: "/home", element:<ProtectedRoute> <Home /></ProtectedRoute> },
      { path: "/saved", element: <ProtectedRoute><SavedPost /></ProtectedRoute> },
      { path: "/liked", element: <ProtectedRoute><LikedPosts /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute> <Profile /></ProtectedRoute> },
      { path: "/profile/:id", element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: "/post/:id", element: <ProtectedRoute> <PostPage /></ProtectedRoute> },
      { path: "/search", element: <ProtectedRoute><SearchResults /></ProtectedRoute> },
      { path: "/suggestions", element: <ProtectedRoute><main className="min-h-screen bg-softRose p-4 sm:p-6"><div className="mx-auto max-w-2xl"><FollowSuggestions /></div></main></ProtectedRoute> },
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
