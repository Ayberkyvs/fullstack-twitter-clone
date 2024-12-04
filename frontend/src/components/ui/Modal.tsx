import React from 'react'
import CreatePost from '../../pages/home/CreatePost';

const Modal = ({className, children, modalName}: {className?:string, children: React.ReactNode, modalName: string}) => {
  return (
    <div className={className}>
    {children}
    <input type="checkbox" id={modalName} className="modal-toggle" />
    <div className="modal" role="dialog">
        <div className="modal-box overflow-auto scrollbar-hide">
            <CreatePost className="flex"/>
        </div>
        <label className="modal-backdrop" htmlFor={modalName}>Close</label>
    </div>
    </div>
  )
}

export default Modal