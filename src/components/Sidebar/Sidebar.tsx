import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiBookmark } from "react-icons/hi";
import { AuthCreatedContext } from "../../context/AuthContext";
import { AiFillLike } from "react-icons/ai";

export default function Sidebar() {
  const { user } = useContext(AuthCreatedContext);

  return (
  <aside className="sticky top-14 z-20 hidden h-fit w-60 shrink-0 self-start flex-col gap-2 border-r border-lightPink p-4 lg:flex">
      <Link
        to="/profile"
        className="mb-3 flex items-center gap-3 rounded-xl p-3 font-semibold text-burgundy hover:bg-softRose border border-transparent transition-all duration-300 hover:border-lightPink">
        {user?.photo ? (
          <img
            src={user.photo}
            alt=""
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-11 items-center justify-center rounded-full bg-gray-200">
            {user?.name?.charAt(0)}
          </div>
        )}

        <span>{user?.name ?? "Profile"}</span>
      </Link>

      <NavLink
        to="/saved"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl p-3 font-semibold transition ${
            isActive
              ? "bg-linear-to-r from-burgundy via-primePink to-lightPink text-softRose"
              : "text-burgundy hover:bg-softRose border border-transparent transition-all duration-300 hover:border-lightPink"
          }`
        }>
        <HiBookmark className="size-6" />
        <span>Saved Posts</span>
      </NavLink>

      <NavLink
        to="/liked"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl p-3 font-semibold ${
            isActive
              ? "bg-linear-to-r from-burgundy via-primePink to-lightPink text-softRose "
              : "text-burgundy hover:bg-softRose border border-transparent transition-all duration-300 hover:border-lightPink"
          }`
        }>
        <AiFillLike className="size-6" />
        <span>Liked Posts</span>
      </NavLink>
    </aside>
  );
}
