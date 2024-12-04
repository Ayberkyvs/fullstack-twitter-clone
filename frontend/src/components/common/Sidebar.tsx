import { Link, useLocation } from "react-router-dom";
import Logo from "../svgs/Logo";
import { GoSidebarExpand, GoSidebarCollapse} from "react-icons/go";
import { menuItems } from "../../utils/config";
import { IoSend } from "react-icons/io5";
import Modal from "../ui/Modal";

const Sidebar = ({collapse, setCollapse}: {collapse: boolean, setCollapse: (value: boolean) => void}) => {
    const location = useLocation();
    let pathname = location.pathname;
    return (
    <div className={`hidden xs:flex flex-col w-full h-full py-3 border-r border-base-content/10 gap-5 ${collapse ? "" : "xl:px-5"}`}>
        <Logo className="w-10 h-10 fill-primary mx-4"/>
        <nav className="flex flex-col justify-between w-full h-full">
            <ul className={`flex flex-col justify-center items-center ${collapse ? "" : "xl:items-start"} gap-2`}>
                {Object.keys(menuItems).map((key) => {
                    const isActive = menuItems[key].link === pathname;
                    return (
                    <li key={key}>
                        <Link to={menuItems[key].link} className={`btn btn-ghost text-xl gap-5 rounded-lg w-fit ${isActive ? "font-bold" : "font-normal"}`}>
                        {isActive ? menuItems[key].activeIcon : menuItems[key].icon}
                        <span className={`hidden ${collapse ? "hidden" : "xl:flex"}`}>
                        {menuItems[key].text}</span></Link>
                    </li>
                    )
                })}
                <li className="w-full mt-5 px-2">
                    <Modal modalName="create_post_model">
                        <label className="btn btn-primary font-bold rounded-full p-0 py-2 w-full" role="button" htmlFor="create_post_model"><IoSend className={`w-[1.3em] h-[1.3em] flex ${collapse ? "flex" : "xl:hidden"}`}/> <span className={`hidden ${collapse ? "hidden" : "xl:flex text-lg"}`}>Post</span></label>
                    </Modal>
                </li>
            </ul>
            <button className={`hidden xl:flex btn btn-ghost text-xl font-bold w-fit rounded-full py-2 ${collapse ? "place-self-center" : "place-self-end"}`} type="button" onClick={() => setCollapse(!collapse)}>{collapse ? <GoSidebarCollapse className="w-[1.4em] h-[1.4em]"/> : <GoSidebarExpand className="w-[1.4em] h-[1.4em]"/>}</button>
        </nav>
    </div>
    )
};
export default Sidebar;