import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ExplorePage from "./pages/explore/ExplorePage";
import BookmarksPage from "./pages/bookmarks/BookmarksPage";
import SettingsPage from "./pages/settings/SettingsPage";

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import React from "react";
import Header from "./components/common/Header";
import Dock from "./components/common/Dock";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {
  const navigate = useNavigate();
  const [collapse, setCollapse] = React.useState(false);
  React.useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html")?.setAttribute("data-theme", localTheme!);
  }, []);

  const { data: authUser, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "An error occurred while fetching user");
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading) return <div className="flex justify-center items-center w-full h-screen"><LoadingSpinner size="lg"/></div>;
  if (isError) navigate("/login");
  return (
    <>
      <Toaster
      position="bottom-center"
      reverseOrder={false}/>
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
            <Header />
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