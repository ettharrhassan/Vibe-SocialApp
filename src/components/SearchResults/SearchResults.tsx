import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { AuthCreatedContext } from "../../context/AuthContext";
import FollowButton from "../Follow/FollowButton";

const API_URL = "https://route-posts.routemisr.com";
const POSTS_PER_PAGE = 20;
const MAX_PAGES = 50;

type SearchUser = {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
};

type SearchPost = {
  _id: string;
  id?: string;
  body?: string;
  image?: string;
  createdAt?: string;
  user?: SearchUser;
};

type SearchTab = "accounts" | "posts";

function normalizeText(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase();
}

export default function SearchResults() {
  const { token, userId } = useContext(AuthCreatedContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const [draftQuery, setDraftQuery] = useState(query);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);
  const activeTab: SearchTab =
    searchParams.get("tab") === "accounts" ? "accounts" : "posts";

  const requestConfig = {
    headers: { token },
  };

  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery<SearchPost[]>({
    queryKey: ["searchResultsPosts", token],
    enabled: Boolean(token),
    queryFn: async () => {
      let page = 1;
      let allPosts: SearchPost[] = [];
      const seenPostIds = new Set<string>();

      while (page <= MAX_PAGES) {
        const { data } = await axios.get(`${API_URL}/posts`, {
          ...requestConfig,
          params: {
            page,
            limit: POSTS_PER_PAGE,
          },
        });

        const pagePosts: SearchPost[] = data?.data?.posts ?? [];

        if (pagePosts.length === 0) {
          break;
        }

        const newPosts = pagePosts.filter((post) => {
          const postId = post._id ?? post.id;

          if (!postId || seenPostIds.has(postId)) {
            return false;
          }

          seenPostIds.add(postId);
          return true;
        });

        if (newPosts.length === 0) {
          break;
        }

        allPosts = [...allPosts, ...newPosts];

        const pagination =
          data?.meta?.pagination ?? data?.data?.meta?.pagination;

        const totalPages =
          pagination?.numberOfPages ??
          pagination?.totalPages ??
          (pagination?.total
            ? Math.ceil(pagination.total / POSTS_PER_PAGE)
            : undefined);

        if (totalPages !== undefined && page >= totalPages) {
          break;
        }

        if (totalPages === undefined && pagePosts.length < POSTS_PER_PAGE) {
          break;
        }

        page += 1;
      }

      return allPosts;
    },
  });

  const {
    data: suggestions = [],
    isLoading: accountsLoading,
    isError: accountsError,
  } = useQuery<SearchUser[]>({
    queryKey: ["searchAccountSuggestions", token],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/users/suggestions?limit=10`,
        requestConfig,
      );

      const result =
        data?.data?.users ??
        data?.data?.suggestions ??
        data?.data?.suggestedUsers ??
        data?.users ??
        data?.suggestions ??
        data?.suggestedUsers ??
        [];

      return Array.isArray(result) ? result : [];
    },
  });

  const normalizedQuery = normalizeText(query);

  const usersById = new Map<string, SearchUser>();

  [...suggestions, ...posts.map((post) => post.user).filter(Boolean)].forEach(
    (user) => {
      if (user?._id) {
        usersById.set(user._id, user);
      }
    },
  );

  const matchingAccounts = [...usersById.values()].filter((user) => {
    const searchableText = normalizeText(
      `${user.name ?? ""} ${user.username ?? ""}`,
    );

    return user._id !== userId && searchableText.includes(normalizedQuery);
  });

  const matchingPosts = posts.filter((post) => {
    const searchableText = normalizeText(post.body ?? "");
    return searchableText.includes(normalizedQuery);
  });

  function selectTab(tab: SearchTab) {
    setSearchParams({
      q: query,
      tab,
    });
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-5 text-lg font-bold leading-tight text-burgundy sm:text-2xl">
        Search results for “{query}”
      </h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchParams({ q: draftQuery.trim(), tab: activeTab });
        }}
        className="mb-5 flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-lightPink"
      >
        <input
          type="search"
          value={draftQuery}
          onChange={(event) => setDraftQuery(event.target.value)}
          placeholder="Search people, posts..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-primePink"
        />
        <button
          type="submit"
          aria-label="Search"
          className="text-burgundy transition-transform duration-300 hover:scale-110"
        >
          <FaSearch />
        </button>
      </form>

      <div className="mb-6 flex gap-3 border-b border-lightPink">
        <button
          type="button"
          onClick={() => selectTab("accounts")}
          className={`px-4 py-3 font-medium ${
            activeTab === "accounts"
              ? "border-b-2 border-burgundy text-burgundy"
              : "text-gray-500"
          }`}
        >
          Accounts
        </button>

        <button
          type="button"
          onClick={() => selectTab("posts")}
          className={`px-4 py-3 font-medium ${
            activeTab === "posts"
              ? "border-b-2 border-burgundy text-burgundy"
              : "text-gray-500"
          }`}
        >
          Posts
        </button>
      </div>

      {activeTab === "accounts" ? (
        accountsLoading || postsLoading ? (
          <p className="text-gray-500">Loading accounts...</p>
        ) : accountsError && postsError ? (
          <p className="text-red-600">Could not load accounts.</p>
        ) : matchingAccounts.length === 0 ? (
          <p className="text-gray-500">No matching accounts.</p>
        ) : (
          <div className="space-y-3">
            {matchingAccounts.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-lightPink bg-white p-4 transition hover:bg-softRose"
              >
                <Link to={`/profile/${user._id}`} className="flex min-w-0 items-center gap-3">
                  <img
                    src={user.photo || "https://i.pravatar.cc/100?img=12"}
                    alt={user.name}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-burgundy">{user.name}</p>
                    {user.username && <p className="truncate text-sm text-gray-500">@{user.username}</p>}
                  </div>
                </Link>
                <FollowButton user={user} compact />
              </div>
            ))}
          </div>
        )
      ) : postsLoading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : postsError ? (
        <p className="text-red-600">Could not load posts.</p>
      ) : matchingPosts.length === 0 ? (
        <p className="text-gray-500">No matching posts.</p>
      ) : (
        <div className="space-y-4">
          {matchingPosts.map((post) => (
            <Link
              key={post._id ?? post.id}
              to={`/post/${post.id ?? post._id}`}
              className="block rounded-2xl border border-lightPink bg-white p-4 transition hover:bg-softRose/30"
            >
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={
                    post.user?.photo ||
                    "https://i.pravatar.cc/100?img=12"
                  }
                  alt={post.user?.name ?? "User"}
                  className="size-10 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-burgundy">
                    {post.user?.name ?? "User"}
                  </p>

                  {post.user?.username && (
                    <p className="text-sm text-gray-500">
                      @{post.user.username}
                    </p>
                  )}
                </div>
              </div>

              {post.body && (
                <p className="whitespace-pre-wrap">{post.body}</p>
              )}

              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="mt-3 max-h-96 w-full rounded-xl object-cover"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}