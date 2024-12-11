
import React from 'react'

const HighlightsSection = ({title, className, children}: {title: string, className?:string, children:React.ReactNode}) => {
  return (
    <div className={`flex flex-col w-full h-fit bg-base-200 rounded-lg ${className}`}>
        <h3 className='text-base-content text-xl font-bold mb-5'>{title}</h3>
        {children}
    </div>
  )
}


export default HighlightsSection