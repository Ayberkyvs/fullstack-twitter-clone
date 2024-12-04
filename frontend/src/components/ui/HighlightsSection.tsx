import React from 'react'

const HighlightsSection = ({title, content, className}: {title: string, content: React.ReactNode, className?:string}) => {
  return (
    <div className={`flex flex-col w-full h-fit p-4 bg-base-200 rounded-lg ${className}`}>
        <h3 className='text-base-content text-xl font-bold mb-5'>{title}</h3>
        {content}
    </div>
  )
}

export default HighlightsSection