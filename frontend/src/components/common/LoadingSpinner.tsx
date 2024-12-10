const LoadingSpinner = ({size, className}: {size:string, className?:string}) => {
  const sizeClass = `loading-${size}`
  return (
    <span className={`${sizeClass} loading loading-spinner text-primary ${className}`}></span>
  )
}

export default LoadingSpinner