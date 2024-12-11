import React from 'react'
import { UserType } from '../../utils/types'
import { Link } from 'react-router-dom'

const User = ({user, rightButton}: {user: UserType, rightButton?: React.ReactNode}) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center w-full h-fit gap-3">
            <Link to={`/profile/${user.username}`} className='avatar'>
                <div className='w-10 h-10 rounded-full'>
                    <img
                        src={user?.profileImg || "/avatar-placeholder.png"}
                        alt={`${user?.fullName || "User"} profile picture`}/>
                </div>
            </Link>
			<div
				className="w-fit items-start h-full">
				<div
					className="flex gap-[4px] text-base font-bold">
					<h3>{user.fullName}</h3>
					{/* <span>Badge</span> */}
				</div>
				<div
					className="flex text-base-content/35 text-sm">
					<span>@{user.username}</span>
				</div>
            </div>
            {rightButton}
    </div>
  )
}

export default User