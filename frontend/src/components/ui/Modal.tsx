import React from "react";
const Modal = ({
  className,
  children,
  modalName,
  modalBoxClassName,
  trigger,
}: {
  className?: string;
  children: React.ReactNode;
  modalName: string;
  modalBoxClassName?: string;
  trigger: React.ReactNode;
}) => {
  return (
    <>
    {trigger}
    <dialog id={modalName} className={`modal ${className}`}>
      <div className={`modal-box ${modalBoxClassName}`}>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={() => {
          const modal = document.getElementById(`${modalName}`) as HTMLDialogElement | null;
          modal?.close();
        }}>close</button>
      </form>
    </dialog>
    </>
  );
};

export default Modal;


{/* <button className="btn" onClick={()=>document.getElementById('my_modal_2').showModal()}>open modal</button> */}