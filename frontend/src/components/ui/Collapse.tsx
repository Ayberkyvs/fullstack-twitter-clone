import React from 'react'

const Collapse = ({title, className, children}:{title:string, className?:string, children: React.ReactNode}) => {
    return (
        <div className={`collapse bg-base-200 collapse-arrow rounded-none z-[0] ${className}`}>
            <input type="checkbox" aria-label="Theme Settings"/>
            <div className="collapse-title text-base font-medium">{title}</div>
            <div className="collapse-content">
                {children}
            </div>
        </div>
    )
}

export default Collapse