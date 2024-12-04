import {Navigate, Route, Routes} from "react-router-dom"
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import React from "react"
import Header from "./components/common/Header"
import Dock from "./components/common/Dock"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import ExplorePage from "./pages/explore/ExplorePage"

function App() {
    const [collapse, setCollapse] = React.useState(false);
    const authUser = true;
    return (
        <> < div className = {
            `${authUser
                ? `grid grid-cols-1 xs:grid-cols-[minmax(0,70px)_1fr] lg:grid-cols-[minmax(0,70px)_1fr_minmax(0,330px)] xl:grid-cols-[minmax(0,${collapse
                    ? "70px"
                    : "330px"})_1fr_minmax(0,330px)]`
                : "flex"} justify-center max-w-screen-2xl w-full h-screen fixed top-0 left-[50%] transform -translate-x-1/2`
        } > {/* Sidebar */
        } {
            authUser && <> < Sidebar collapse = {
                collapse
            }
            setCollapse = {
                setCollapse
            } /> <Header/>
            </>
        } {/* Main Content - Scrollable */
        } < main className = "overflow-auto scrollbar-hide" > <Routes>
            <Route
                path="/"
                element={authUser
                    ? <HomePage/>
                    : <Navigate to="/login"/>
                }
            />
            <Route
                path="/login"
                element={!authUser
                    ? <LoginPage/>
                    : <Navigate to="/"/>
                }
            />
            <Route
                path="/signup"
                element={!authUser
                    ? <SignUpPage/>
                    : <Navigate to="/"/>
                }
            />
            <Route
                path="/explore"
                element={authUser
                    ? <ExplorePage />
                    : <Navigate to="/login"/>
                }
            />
            <Route
                path="/notifications"
                element={authUser
                    ? <NotificationPage/>
                    : <Navigate to="/login"/>
                }
            />
            <Route
                path="/profile"
                element={authUser
                    ? <ProfilePage />
                    : <Navigate to="/login"/>
                }
            />
        </Routes>
    </main>

            {/* Right Panel */
        } {
            authUser && <div className="overflow-auto scrollbar-hide">
                    <RightPanel/>
                    <Dock/>
                </div>
        } </div>
    </>
    )
}

export default App
