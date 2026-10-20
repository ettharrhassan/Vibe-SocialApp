import { useContext, useState } from "react";
import { FaHome, FaSearch, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { AuthCreatedContext } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", icon: FaHome, path: "/home" },
  { name: "profile", icon: CgProfile, path: "/profile" },
];

export default function Navbar() {
  const { token, removeToken } = useContext(AuthCreatedContext);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50   bg-linear-to-r from-burgundy via-primePink to-lightPink ">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-primePink to-lightPink  text-2xl font-bold text-softRose">
            V
          </div>
          <span className="bg-linear-to-r from-lightPink to-softRose bg-clip-text text-transparent text-xl font-bold">
            ibe {""}
            <span className="text-burgundy">.</span>
          </span>
        </Link>

        {/* Search */}
        <div className="hidden max-w-sm flex-1 md:flex">
          <div className="flex w-full items-center gap-3 rounded-xl bg-gray-100 px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-lightPink">
            <FaSearch className="text-burgundy" />
            <input
              type="search"
              placeholder="Search people, posts..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-primePink"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-semibold ${
                  isActive
                    ? "bg-softRose text-burgundy"
                    : "text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all hover:text-burgundy duration-300 hover:bg-softRose"
                }`
              }>
              <Icon size={20} />
              {name}
            </NavLink>
          ))}
        </div>

        {token ? (
          <button
            onClick={removeToken}
            className="text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all hover:text-burgundy duration-300 hover:bg-softRose">
            {" "}
            LogOut{" "}
          </button>
        ) : (
          <>
            <Link
              to={"/login"}
              className="text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all hover:text-burgundy duration-300 hover:bg-softRose">
              {" "}
              LogIn{" "}
            </Link>
            <Link
              to={"/signup"}
              className="text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all hover:text-burgundy duration-300 hover:bg-softRose">
              {" "}
              SignUp{" "}
            </Link>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Messages"
            className="group relative hidden h-10 w-10 items-center justify-center rounded-xl  transition-all duration-300 bg-softRose text-burgundy  hover:text-primePink sm:flex">
            <IoChatbubbleEllipses size={21} />
            <span className=" group-hover:bg-primePink transition-all duration-300 absolute right-2 top-2 h-2 w-2 rounded-full bg-burgundy ring-2 ring-white" />
          </button>

          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-softRose text-burgundy transition-all duration-300 hover:text-primePink">
            <FaBell size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-softRose">
              3
            </span>
          </button>

          {/* Profile */}
          <button className="hidden items-center gap-2 rounded-xl p-1.5 hover:bg-softRose sm:flex transition-all duration-300">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Your profile"
              className="h-9 w-9 rounded-full object-cover"
            />
            <MdKeyboardArrowDown className="text-burgundy" size={20} />
          </button>

          {/* Mobile menu */}
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden">
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white p-3 lg:hidden">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 md:hidden">
            <FaSearch className="text-gray-400" />
            <input
              type="search"
              placeholder="Search people, posts..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

        </div>
      )}
    </nav>
  );
}
