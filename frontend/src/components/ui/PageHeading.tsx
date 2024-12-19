import { GoArrowLeft } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { UserType } from "../../utils/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CurrentUser from "./CurrentUser";
import Logo from "../svgs/Logo";
import MenuItems from "../../utils/MenuItems";
import Search from "./Search";
const PageHeading = ({
  title,
  subtitle,
  className,
  children,
  headerMobile
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  headerMobile: boolean;
}) => {
  const navigate = useNavigate();
  const menuItems = MenuItems();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
React.useEffect(() => {
    document.documentElement.style.overflow = isDrawerOpen ? "hidden" : "auto";
}, [isDrawerOpen]);
  if (headerMobile) {
    return (
        <div className="sticky top-0 xs:hidden drawer z-[2]">
            <input
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle"
                onChange={(e) => setIsDrawerOpen(e.target.checked)} // Drawer state kontrolü
            />
            <div className={`drawer-content overflow-hidden ${className}`}>
                {/* Page content here */}
                <div
                    className="relative flex xs:hidden navbar bg-base-100 px-3 *:border-b-0"
                >
                    <label
                        htmlFor="my-drawer"
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar drawer-button"
                    >
                        <div className="w-10 rounded-full">
                            <img
                                src={authUser?.profileImg !== null && authUser?.profileImg || "/avatar-placeholder.png"}
                                alt={`${authUser?.fullName} avatar`}
                                className="w-full h-full rounded-full"
                            />
                        </div>
                    </label>
                    <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        <Link to="/">
                            <Logo className="fill-primary w-8 h-8" />
                        </Link>
                    </div>
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
                    <CurrentUser />
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
                    <li className="mt-4">
                      <Search className="border p-0"/>
                    </li>
                </ul>
            </div>
        </div>
    )
  }
  return (
    <div
      className={`flex justify-between w-full h-fit navbar bg-base-100 border-b border-base-content/10 p-4 ${className}`}
    >
      <div className="w-fit h-full items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          title="Previous Page"
          type="button"
          className="btn btn-circle btn-ghost"
        >
          <GoArrowLeft className="w-[1.3em] h-[1.3em]" />
        </button>
        <div className="flex flex-col items-start w-fit h-fit">
          <h3 className="text-base xs:text-xl font-bold">{title}</h3>
          <p className="text-sm xs:text-base text-neutral">{subtitle}</p>
        </div>
      </div>
      {children && children}
    </div>
  );
};

export default PageHeading;
