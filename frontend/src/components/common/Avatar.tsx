import { Link } from 'react-router-dom'
const Avatar = ({user, className}: {user:any, className:string}) => {
  return (
    <Link to={`/${user?.username}`} className={`flex-shrink-0 ${className}`}>
        <img
            src={user?.profileImg !== null && user?.profileImg || "/avatar-placeholder.png"}
            alt={`${user?.fullName} avatar`}
            className="w-full h-full rounded-full object-cover"
        />
    </Link>
  )
}

export default Avatar