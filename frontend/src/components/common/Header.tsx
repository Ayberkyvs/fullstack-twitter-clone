import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../svgs/Logo";
import { BsThreeDots } from "react-icons/bs";
import User from "../ui/User";
import { AUTH_USER } from "../../utils/db/dummy";
import React from "react";
import { menuItems } from "../../utils/config";
import Search from "../ui/Search";
import { GoArrowLeft } from "react-icons/go";

const Header = () => {
    const [isBorderVisible, setIsBorderVisible] = React.useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false); // Drawer durumu
    const location = useLocation();
    const pathname = location.pathname.replace("/", ""); // "/" kaldırılır
    const isRoot = pathname === "";
    const navigate = useNavigate();
    // Drawer açılma durumunu kontrol et
    React.useEffect(() => {
        document.documentElement.style.overflow = isDrawerOpen ? "hidden" : "auto";
    }, [isDrawerOpen]);

    // Border görünürlüğünü pathname'e göre ayarla
    React.useEffect(() => {
        setIsBorderVisible(pathname !== "" && pathname !== "explore" && pathname !== "profile");
        // setIsDrawerOpen(true);
    }, [location.pathname]);

    // Sayfa başlığını belirleyen işlev
    const findCorrectPageHeading = () => {
        switch (pathname) {
            case "explore":
                return <Search className="ml-2 w-full" />;
            case "profile":
                return(
                <>
                <button onClick={()=> navigate(-1)} title="Previous Page" type="button" className="btn btn-circle btn-ghost">
                    <GoArrowLeft className="w-[1.3em] h-[1.3em]" />
                    </button>
                    <div className="flex flex-col items-start w-fit h-fit">
                    <p className="text-xl font-bold">John Doe</p>
                    <span className='text-sm text-neutral'>99 posts</span>
                </div>
                </>
                );
            case "login":
                return "Login";
            case "signup":
                return "Sign Up";
            default:
                return (
                    <h1 className="text-lg font-bold ml-1">
                        {pathname.charAt(0).toUpperCase() + pathname.slice(1)}
                    </h1>
                );
        }
    };

    return (
        <div className="sticky top-0 xs:hidden drawer z-[2]">
            <input
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle"
                onChange={(e) => setIsDrawerOpen(e.target.checked)} // Drawer state kontrolü
            />
            <div className="drawer-content">
                {/* Page content here */}
                <div
                    className={`relative flex xs:hidden navbar bg-base-100 px-3 ${
                        isBorderVisible ? "border-b border-base-content/10" : "border-b-0"
                    }`}
                >
                {pathname !== "profile" &&
                    <label
                        htmlFor="my-drawer"
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar drawer-button"
                    >
                        <div className="w-8 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </label>
                }
                    {isRoot && (
                        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                            <Link to="/">
                                <Logo className="fill-primary w-8 h-8" />
                            </Link>
                        </div>
                    )}
                    {!isRoot && findCorrectPageHeading()}
                </div>
            </div>
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu flex flex-col gap-2 bg-base-200/100 text-base-content min-h-full w-64 p-4">
                    {/* Sidebar content here */}
                    <User
                        user={AUTH_USER}
                        rightButton={
                            <li>
                                <button
                                    title="More"
                                    type="button"
                                    className="text-lg text-neutral"
                                >
                                    <BsThreeDots />
                                </button>
                            </li>
                        }
                    />
                    <li>
                        <br />
                    </li>
                    {Object.keys(menuItems).map((key) => {
                        if (!menuItems[key].inDock) {
                            const isActive = menuItems[key].link === location.pathname;
                            return (
                                <li key={key} className="w-full">
                                    <Link
                                        to={menuItems[key].link}
                                        className="flex justify-start items-center btn btn-ghost text-lg gap-5 rounded-lg w-full font-normal p-0"
                                    >
                                        {isActive ? menuItems[key].activeIcon : menuItems[key].icon}
                                        <span className="flex">
                                            {menuItems[key].text}
                                        </span>
                                    </Link>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Header;
