import { GoHome, GoPerson, GoBell, GoBookmark, GoPersonFill, GoBookmarkFill, GoHomeFill, GoBellFill } from "react-icons/go";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
import MessageIcon from "../components/svgs/MessageIcon";
import GearIcon from "../components/svgs/GearIcon";
import { useQuery } from "@tanstack/react-query";
import { MenuItemsType, UserType } from "./types";

const staticMenuItems: MenuItemsType = {
  Home: {
    icon: <GoHome className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <GoHomeFill className="w-[1.3em] h-[1.3em]" />,
    text: "Home",
    link: "/",
    inDock: true,
  },
  Explore: {
    icon: <MdOutlineExplore className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <MdExplore className="w-[1.3em] h-[1.3em]" />,
    text: "Explore",
    link: "/explore",
    inDock: true,
  },
  Notifications: {
    icon: <GoBell className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <GoBellFill className="w-[1.3em] h-[1.3em]" />,
    text: "Notifications",
    link: "/notifications",
    inDock: true,
  },
  Messages: {
    icon: <MessageIcon className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <MessageIcon className="w-[1.3em] h-[1.3em]" active />,
    text: "Messages",
    link: "/messages",
    inDock: true,
  },
  Bookmarks: {
    icon: <GoBookmark className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <GoBookmarkFill className="w-[1.3em] h-[1.3em]" />,
    text: "Bookmarks",
    link: "/bookmarks",
    inDock: true,
  },
  Profile: {
    icon: <GoPerson className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <GoPersonFill className="w-[1.3em] h-[1.3em]" />,
    text: "Profile",
    link: "",
    inDock: false,
  },
  Settings: {
    icon: <GearIcon className="w-[1.3em] h-[1.3em]" />,
    activeIcon: <GearIcon className="w-[1.3em] h-[1.3em] fill-base-content" active />,
    text: "Settings & Theme",
    link: "/settings",
    inDock: false,
  },
};

const MenuItems = () => {
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const menuItems = { ...staticMenuItems };

  // Kullanıcı verisine göre 'Profile' linkini güncelle
  if (authUser) {
    menuItems.Profile.link = `/${authUser.username}`;
  }

  return menuItems;
};

export default MenuItems;
