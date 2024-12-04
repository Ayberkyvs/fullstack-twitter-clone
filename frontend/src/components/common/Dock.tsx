import React from 'react';
import {menuItems} from '../../utils/config'
import { Link, useLocation } from 'react-router-dom'
const Dock = () => {
    const location = useLocation();
    let pathname = location.pathname;
    return (
        <div className="fixed xs:hidden bottom-0 z-[1] btm-nav">
            {Object.keys(menuItems).map((key) => {
                const isActive = menuItems[key].link === pathname;
                if (menuItems[key].inDock) {
                return (
                <button title={menuItems[key].text} key={key} type='button' className={`${isActive ? "active" : ""}`}>
                    <Link
                    to={menuItems[key].link}>
                        {isActive ? menuItems[key].activeIcon : menuItems[key].icon}
                    </Link>
                </button>
                )}
            })}
        </div>
    )
}

export default Dock