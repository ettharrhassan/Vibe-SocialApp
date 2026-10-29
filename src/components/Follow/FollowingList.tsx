import { Link } from "react-router-dom";
import { useFollowingData } from "./useFollowingData";

export default function FollowingList() {
  const { data, isLoading, isError } = useFollowingData();
  const count = data?.count;

  return (
    <section className="mt-3 border-t border-lightPink pt-4">
      <h2 className="mb-3 font-semibold text-burgundy">Following{count != null ? ` (${count})` : ""}</h2>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading following…</p>
      ) : isError ? (
        <p className="text-sm text-gray-500">Could not load following.</p>
      ) : data?.users.length ? (
        <div className="following-scrollbar max-h-64 space-y-1 overflow-y-auto">
          {data.users.map((user) => (
            <Link key={user._id} to={`/profile/${user._id}`} className="flex min-w-0 items-center gap-2 rounded-xl p-2 text-sm text-burgundy transition hover:bg-softRose">
              <img src={user.photo || "https://i.pravatar.cc/100?img=12"} alt="" className="size-8 shrink-0 rounded-full object-cover" />
              <span className="truncate">{user.name || user.username || "User"}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">You aren't following anyone yet.</p>
      )}
    </section>
  );
}