import { useContext, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHome, FaSearch, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthCreatedContext } from "../../context/AuthContext";

type Notification = {
  _id?: string;
  id?: string;
  isRead?: boolean;
  createdAt?: string;
  type?: string;
  actor?: {
    name?: string;
  };
  entity?: {
    body?: string;
    topComment?: {
      content?: string;
    } | null;
  };
  entityType?: string;
  entityId?: string;
};

const API_URL = "https://route-posts.routemisr.com";

const navLinks = [
  { name: "Home", icon: FaHome, path: "/home" },
  { name: "profile", icon: CgProfile, path: "/profile" },
];

export default function Navbar() {
  const { token, removeToken, user } = useContext(AuthCreatedContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestConfig = { headers: { token } };

  const { data: notifications = [], isLoading: notificationsLoading } =
    useQuery<Notification[]>({
      queryKey: ["notifications", token],
      enabled: Boolean(token) && notificationsOpen,
      queryFn: async () => {
        const { data } = await axios.get(
          `${API_URL}/notifications?unread=false&page=1&limit=10`,
          requestConfig,
        );

        return data?.data?.notifications ?? data?.notifications ?? [];
      },
    });

  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ["notificationUnreadCount", token],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/notifications/unread-count`,
        requestConfig,
      );

      return Number(
        data?.data?.unreadCount ??
          data?.data?.count ??
          data?.unreadCount ??
          data?.count ??
          0,
      );
    },
  });

  function refreshNotifications() {
    queryClient.invalidateQueries({
      queryKey: ["notifications", token],
    });
    queryClient.invalidateQueries({
      queryKey: ["notificationUnreadCount", token],
    });
  }

  const markOneRead = useMutation({
    mutationFn: (notificationId: string) =>
      axios.patch(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        requestConfig,
      ),
    onSuccess: refreshNotifications,
  });

  const markAllRead = useMutation({
    mutationFn: () =>
      axios.patch(`${API_URL}/notifications/read-all`, {}, requestConfig),
    onSuccess: refreshNotifications,
  });

  function submitSearch() {
    const query = searchQuery.trim();

    if (!query) return;

    setMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);

    navigate(`/search?q=${encodeURIComponent(query)}&tab=posts`);
  }

  function handleSignOut() {
    setProfileOpen(false);
    removeToken();
    navigate("/login", { replace: true });
  }

  function toggleNotifications() {
    setNotificationsOpen((open) => !open);
    setProfileOpen(false);
  }

  function toggleProfile() {
    setProfileOpen((open) => !open);
    setNotificationsOpen(false);
  }

  function getNotificationMessage(item: Notification) {
    const actor = item.actor?.name ?? "Someone";
    const post = item.entity?.body?.trim();
    const comment = item.entity?.topComment?.content?.trim();

    if (item.type === "comment_post") {
      return `${actor} commented on your post${
        post ? `: "${post}"` : ""
      }${comment ? ` — "${comment}"` : ""}`;
    }

    if (item.type === "like_post") {
      return `${actor} liked your post${post ? `: "${post}"` : ""}`;
    }

    return `${actor} sent you a notification.`;
  }

  function openNotification(item: Notification) {
    const notificationId = item._id ?? item.id;

    setNotificationsOpen(false);
    setProfileOpen(false);
    setMenuOpen(false);

    if (notificationId && !item.isRead) {
      markOneRead.mutate(notificationId);
    }

    if (item.entityType === "post" && item.entityId) {
      navigate(`/post/${item.entityId}`);
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-burgundy via-primePink to-lightPink">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-primePink to-lightPink text-2xl font-bold text-softRose">
            V
          </div>

          <span className="bg-linear-to-r from-lightPink to-softRose bg-clip-text text-xl font-bold text-transparent">
            ibe <span className="text-burgundy">.</span>
          </span>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
          className="hidden max-w-sm flex-1 md:flex">
          <div className="flex w-full items-center gap-3 rounded-xl bg-gray-100 px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-lightPink">
            <button
              type="submit"
              aria-label="Search"
              className="cursor-pointer text-burgundy">
              <FaSearch />
            </button>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search people, posts..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-primePink"
            />
          </div>
        </form>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-softRose text-burgundy"
                    : "cursor-pointer py-2.5 font-medium text-softRose hover:bg-softRose hover:text-burgundy"
                }`
              }>
              <Icon size={20} />
              {name}
            </NavLink>
          ))}
        </div>

        {/* Login, signup, or logout */}
        {token ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all duration-300 hover:bg-softRose hover:text-burgundy">
            LogOut
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all duration-300 hover:bg-softRose hover:text-burgundy">
              LogIn
            </Link>

            <Link
              to="/signup"
              className="text-softRose cursor-pointer rounded-xl px-4 py-2.5 text-[17px] font-medium transition-all duration-300 hover:bg-softRose hover:text-burgundy">
              SignUp
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Messages"
            className="group relative hidden h-10 w-10 items-center justify-center rounded-xl bg-softRose text-burgundy transition-all duration-300 hover:text-primePink sm:flex">
            <IoChatbubbleEllipses size={21} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-burgundy ring-2 ring-white transition-all duration-300 group-hover:bg-primePink" />
          </button>

          {/* Notifications */}
          {token && (
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={toggleNotifications}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-softRose text-burgundy transition-all duration-300 hover:text-primePink">
                <FaBell size={18} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-softRose">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-lightPink bg-white text-gray-800 shadow-xl">
                  <div className="flex items-center justify-between border-b border-lightPink px-4 py-3">
                    <h2 className="font-semibold text-burgundy">
                      Notifications
                    </h2>

                    <button
                      type="button"
                      disabled={unreadCount === 0 || markAllRead.isPending}
                      onClick={() => markAllRead.mutate()}
                      className="text-sm font-medium text-primePink disabled:cursor-not-allowed disabled:opacity-50">
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notificationsLoading ? (
                      <p className="p-5 text-center text-sm text-gray-500">
                        Loading notifications...
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="p-5 text-center text-sm text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((item, index) => {
                        const notificationId = item._id ?? item.id;
                        const isRead = item.isRead ?? false;
                        const message = getNotificationMessage(item);
                        return (
                          <button
                            type="button"
                            key={notificationId ?? index}
                            onClick={() => openNotification(item)}
                            className={`block w-full cursor-pointer border-b border-gray-100 px-4 py-3 text-left text-sm transition-colors last:border-0 ${
                              isRead
                                ? "bg-white hover:bg-gray-100"
                                : "bg-lightPink/20 hover:bg-lightPink/60"
                            }`}>
                            <span className="flex items-start gap-2">
                              {!isRead && (
                                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primePink" />
                              )}

                              <span className={isRead ? "pl-4" : ""}>
                                {message}
                              </span>
                            </span>

                            {item.createdAt && (
                              <span className="mt-1 block pl-4 text-xs text-gray-400">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile menu */}
          {token && (
            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                onClick={toggleProfile}
                className="hidden h-12 items-center gap-2 rounded-2xl bg-white px-3 sm:flex">
                <img
                  src={user?.photo || "https://i.pravatar.cc/100?img=12"}
                  alt={user?.name ?? "Profile"}
                  className="size-11 rounded-full object-cover"
                />
                <MdKeyboardArrowDown className="text-burgundy" size={20} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-lightPink bg-white p-4 text-gray-800 shadow-xl sm:w-64">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full cursor-pointer rounded-2xl border border-transparent p-3 text-left font-medium text-burgundy transition-all duration-200 hover:border-lightPink hover:bg-softRose">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden">
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation and search */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white p-3 lg:hidden">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
            className="mb-3 flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 md:hidden">
            <button
              type="submit"
              aria-label="Search"
              className="cursor-pointer text-gray-400">
              <FaSearch />
            </button>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search people, posts..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
        </div>
      )}
    </nav>
  );
}
