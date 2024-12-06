import { GoArrowLeft } from "react-icons/go"
import { useNavigate } from "react-router-dom";

const PageHeading = ({title, className, children}: {title:string, className?:string, children?: React.ReactNode}) => {
  const navigate = useNavigate();
  return (
    <div className={`hidden xs:flex justify-start items-center gap-2 w-full h-fit navbar bg-base-100 border-b border-base-content/10 p-4 ${className}`}>
        <button onClick={()=> navigate(-1)} title="Previous Page" type="button" className="btn btn-circle btn-ghost">
          <GoArrowLeft className="w-[1.3em] h-[1.3em]" />
        </button>
        <div className="flex flex-col items-start w-fit h-fit">
          <p className="text-xl font-bold">{title}</p>
          {children}
        </div>
    </div>
  )
}

export default PageHeading