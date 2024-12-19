import Collapse from './Collapse'

const Search = ({className}: {className?: string}) => {
  return (
    <div className={`w-full bg-base-200 rounded-lg ${className}`}>
      <Collapse title='Privacy Policy' className='m-0 rounded-xl'>
        <p className='text-sm leading-relaxed'>Hello, this project was developed by me along with its functionality. It continues to be developed. It has no commercial purpose. Your data is stored on an Amazon-based server in encrypted form and is not used. You can delete your account with your data in the settings.</p>
      </Collapse>
    </div>
    // <label className={`input input-bordered flex items-center gap-5 py-3 ${className}`}>
    //     <IoSearchSharp className="text-neutral" />
    //     <input type="text" className="grow text-base placeholder:text-neutral" placeholder="Search" />
    // </label>
  )
}

export default Search