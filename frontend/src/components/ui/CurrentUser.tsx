import { GoPerson, GoSignOut } from 'react-icons/go'
import { AUTH_USER } from '../../utils/db/dummy'
import DropdownSettings from './DropdownSettings'
import User from './User'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const CurrentUser = () => {
  const queryClient = useQueryClient();
  const {mutate:logoutMutation} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
      });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred while signing in");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    }
  });
  const {data:authUser} = useQuery({queryKey: ["authUser"]});
  console.log(authUser);
  return (
    <User user={authUser} rightButton={
        <DropdownSettings>
            <li><Link to="profile"><GoPerson className='w-[1.3em] h-[1.3em]'/>See your profile</Link></li>
            <li onClick={()=> logoutMutation()}><p><GoSignOut className='w-[1.3em] h-[1.3em]'/> Log out</p></li>
        </DropdownSettings>
    } />
  )
}

export default CurrentUser