import { MenuItems } from "./types";
import { GoHome, GoPerson, GoBell, GoBookmark, GoPersonFill, GoBookmarkFill} from "react-icons/go";
import React from "react";
import { GoHomeFill, GoBellFill } from "react-icons/go";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
import MessageIcon from "../components/svgs/MessageIcon";
import GearIcon from "../components/svgs/GearIcon";

export const menuItems: MenuItems = {
    Home: {
        icon: React.createElement(GoHome, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(GoHomeFill, { className: "w-[1.3em] h-[1.3em]" }),
        text: "Home",
        link: "/",
        inDock: true,
    },
    Explore: {
        icon: React.createElement(MdOutlineExplore, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(MdExplore, { className: "w-[1.3em] h-[1.3em]" }),
        text: "Explore",
        link: "/explore",
        inDock: true,
    },
    Notifications: {
        icon: React.createElement(GoBell, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(GoBellFill, { className: "w-[1.3em] h-[1.3em]" }),
        text: "Notifications",
        link: "/notifications",
        inDock: true,
    },
    Messages: {
        icon: React.createElement(MessageIcon, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(MessageIcon, { className: "w-[1.3em] h-[1.3em]", active: true }),
        text: "Messages",
        link: "/messages",
        inDock: true,
    },
    Bookmarks: {
        icon: React.createElement(GoBookmark, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(GoBookmarkFill, { className: "w-[1.3em] h-[1.3em]" }),
        text: "Bookmarks",
        link: "/bookmarks",
        inDock: true,
    },
    Profile: {
        icon: React.createElement(GoPerson, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(GoPersonFill, { className: "w-[1.3em] h-[1.3em]" }),
        text: "Profile",
        link: "/profile/1",
        inDock: false,
    },
    Settings: {
        icon: React.createElement(GearIcon, { className: "w-[1.3em] h-[1.3em]" }),
        activeIcon: React.createElement(GearIcon, { className: "w-[1.3em] h-[1.3em] fill-base-content", active: true }),
        text: "Settings & Theme",
        link: "/settings",
        inDock: false,
    }
};