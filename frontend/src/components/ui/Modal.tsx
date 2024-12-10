import React from 'react'
const Modal = ({className, children, modalName, trigger}: {className?:string, children: React.ReactNode, modalName: string, trigger: React.ReactNode}) => {
  return (
    <div className={className}>
      {trigger}
    <input type="checkbox" id={modalName} className="modal-toggle" />
    <div className="modal" role="dialog">
        <div className="modal-box overflow-auto scrollbar-hide">
            {children}
        </div>
        <label className="modal-backdrop" htmlFor={modalName}>Close</label>
    </div>
    </div>
  )
}

export default Modal