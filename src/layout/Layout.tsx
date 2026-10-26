import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "./footer/Footer";

export default function Layout() {
  const { pathname } = useLocation();

  const showSidebars =
    pathname === "/" ||
    pathname === "/home" ||
    pathname === "/saved" ||
    pathname === "/liked" ||
    pathname.startsWith("/post/");

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen">
        {showSidebars && (
          <div className="hidden w-60 shrink-0 border-r border-lightPink lg:block">
            <Sidebar />
          </div>
        )}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

        {showSidebars && (
          <div className="hidden w-60 shrink-0 lg:block  border-l border-lightPink" />
        )}
      </div>

      <Footer />
    </>
  );
}
