import {GoArrowLeft} from "react-icons/go"
import {useNavigate} from "react-router-dom";

const PageHeading = ({title, subtitle, className, children} : {
    title: string | React.ReactNode,
    subtitle?: string | React.ReactNode,
    className?: string,
    children?: React.ReactNode
}) => {
    const navigate = useNavigate();
    return (
        <div
            className={`hidden xs:flex justify-between w-full h-fit navbar bg-base-100 border-b border-base-content/10 p-4 ${className}`}>
            <div className="w-fit items-center gap-2 h-full">
                <button
                    onClick={() => navigate(-1)}
                    title="Previous Page"
                    type="button"
                    className="btn btn-circle btn-ghost">
                    <GoArrowLeft className="w-[1.3em] h-[1.3em]"/>
                </button>
                <div className="flex flex-col items-start w-fit h-fit gap-[2px]">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-sm xs:text-base text-neutral">{subtitle}</p>
                </div>
            </div>
            {children && children}
        </div>
    )
}

export default PageHeading