import { BsThreeDots } from "react-icons/bs"

const DropdownSettings = ({buttonClassName, dropDownIcon=<BsThreeDots/>, children}: {buttonClassName?:string, dropDownIcon?: React.ReactNode, children: React.ReactNode}) => {
  return (
    <div className="dropdown dropdown-bottom dropdown-end" onClick={(e) => e.preventDefault()}>
        <div tabIndex={0} role="button" className={`m-1 ${buttonClassName}`}>{dropDownIcon}</div>
        <ul tabIndex={0} className="dropdown-content menu rounded-box z-[1] w-fit min-w-52 p-2 shadow bg-base-200 text-sm text-base-content gap-1">
            {children}
        </ul>
    </div>
  )
}

export default DropdownSettings