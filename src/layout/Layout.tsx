import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "./footer/Footer";
import FollowSuggestions from "../components/Follow/FollowSuggestions";

export default function Layout() {
  const { pathname } = useLocation();

  const showSidebars =
    pathname === "/" ||
    ["/home", "/saved", "/liked", "/profile", "/search"].includes(pathname) ||
    pathname.startsWith("/post/") ||
    pathname.startsWith("/profile/");

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
          <aside className="hidden min-h-[calc(100vh-4rem)] w-72 shrink-0 self-stretch border-l border-lightPink p-4 lg:block">
            <div className="sticky top-20">
              <FollowSuggestions />
            </div>
          </aside>
        )}
      </div>

      <Footer />
    </>
  );
}
