const NotFound = ({className, errorMessage}: {className: string, errorMessage: string}) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full h-full ${className}`}>
        <h1 className='text-base'>{errorMessage}</h1>
    </div>
  )
}

export default NotFound