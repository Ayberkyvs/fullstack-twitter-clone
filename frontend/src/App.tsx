import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load pages
const LoginPage = React.lazy(() => import("./pages/auth/login/LoginPage"));
const SignUpPage = React.lazy(() => import("./pages/auth/signup/SignUpPage"));
const HomePage = React.lazy(() => import("./pages/home/HomePage"));
const NotificationPage = React.lazy(() => import("./pages/notification/NotificationPage"));
const ProfilePage = React.lazy(() => import("./pages/profile/ProfilePage"));
const ExplorePage = React.lazy(() => import("./pages/explore/ExplorePage"));
const BookmarksPage = React.lazy(() => import("./pages/bookmarks/BookmarksPage"));
const SettingsPage = React.lazy(() => import("./pages/settings/SettingsPage"));
const PostPage = React.lazy(() => import("./pages/post/PostPage"));
const FollowersFollowing = React.lazy(() => import("./pages/profile/FollowersFollowing"));

// Lazy load common components
const Sidebar = React.lazy(() => import("./components/common/Sidebar"));
const RightPanel = React.lazy(() => import("./components/common/RightPanel"));
const Dock = React.lazy(() => import("./components/common/Dock"));

function App() {
  const navigate = useNavigate();
  const [collapse, setCollapse] = React.useState(false);
  React.useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html")?.setAttribute("data-theme", localTheme!);
  }, []);

  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok)
          throw new Error(
            data.error || "An error occurred while fetching user"
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (isError) navigate("/login");
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div
        className={`${
          authUser
            ? `grid grid-cols-1 xs:grid-cols-[minmax(0,70px)_1fr] lg:grid-cols-[minmax(0,70px)_1fr_minmax(0,330px)] ${
                collapse
                  ? "xl:grid-cols-[minmax(0,70px)_1fr_minmax(0,330px)]"
                  : "xl:grid-cols-[minmax(0,330px)_1fr_minmax(0,330px)]"
              }`
            : "flex"
        } justify-center max-w-screen-2xl w-full h-screen fixed top-0 left-[50%] transform -translate-x-1/2`}
      >
        {authUser && (
          <>
            <Sidebar collapse={collapse} setCollapse={setCollapse} />
          </>
        )}
        <main className="break-words w-full overflow-auto scrollbar-hide">
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/messages"
              element={!authUser ? <h1>Not yet...</h1> : <Navigate to="/" />}
            />
            <Route
              path="/explore"
              element={authUser ? <ExplorePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/bookmarks"
              element={authUser ? <BookmarksPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/notifications"
              element={
                authUser ? <NotificationPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/settings"
              element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/:username/followers"
              element={authUser ? <FollowersFollowing /> : <Navigate to="/login" />}
            />
            <Route
              path="/:username/following"
              element={authUser ? <FollowersFollowing /> : <Navigate to="/login" />}
            />
            <Route
              path="/:username/status/:id"
              element={authUser ? <PostPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        {authUser && (
          <div className="overflow-auto scrollbar-hide">
            <RightPanel />
            <Dock />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
