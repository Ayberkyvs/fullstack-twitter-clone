import React from 'react'

const Collapse = ({title, children}:{title:string, children: React.ReactNode}) => {
    return (
        <div className="collapse bg-base-200 collapse-arrow rounded-none">
            <input type="checkbox" aria-label="Theme Settings"/>
            <div className="collapse-title text-xl font-medium">{title}</div>
            <div className="collapse-content">
                {children}
            </div>
        </div>
    )
}

export default Collapse