import { GoPerson, GoSignOut } from 'react-icons/go'
import { AUTH_USER } from '../../utils/db/dummy'
import DropdownSettings from './DropdownSettings'
import User from './User'
import { Link } from 'react-router-dom'

const CurrentUser = () => {
  return (
    <User user={AUTH_USER} rightButton={
        <DropdownSettings>
            <li><Link to="profile"><GoPerson className='w-[1.3em] h-[1.3em]'/>See your profile</Link></li>
            <li><a href=""><GoSignOut className='w-[1.3em] h-[1.3em]'/> Log out</a></li>
        </DropdownSettings>
    } />
  )
}

export default CurrentUser