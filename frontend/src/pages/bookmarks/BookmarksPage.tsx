import NotFound from '../../components/common/NotFound'
import PageHeading from '../../components/ui/PageHeading'

const BookmarksPage = () => {
  // Logic goes here
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
        <PageHeading title='Bookmarks' headerMobile={false}/>
        <NotFound className='my-2' errorMessage='Soon...' />
        {/* <Posts feedType='bookmarks'/> */}
    </div>
  )
}

export default BookmarksPage