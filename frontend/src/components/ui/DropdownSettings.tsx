import { BsThreeDots } from "react-icons/bs"

const DropdownSettings = ({buttonClassName, dropDownIcon=<BsThreeDots/>, children}: {buttonClassName?:string, dropDownIcon?: React.ReactNode, children: React.ReactNode}) => {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className={`m-1 ${buttonClassName}`}>{dropDownIcon}</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow bg-base-200">
            {children}
        </ul>
    </div>
  )
}

export default DropdownSettings