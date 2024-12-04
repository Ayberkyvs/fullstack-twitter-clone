import { IoSearchSharp } from 'react-icons/io5'

const Search = ({className}: {className?: string}) => {
  return (
    <label className={`input input-bordered flex items-center gap-5 py-3 ${className}`}>
        <IoSearchSharp className="text-neutral" />
        <input type="text" className="grow text-base placeholder:text-neutral" placeholder="Search" />
    </label>
  )
}

export default Search