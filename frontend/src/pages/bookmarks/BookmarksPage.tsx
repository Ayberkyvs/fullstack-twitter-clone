import Posts from '../../components/common/Posts'
import PageHeading from '../../components/ui/PageHeading'

const BookmarksPage = () => {
  // Logic goes here
  return (
    <div>
        <PageHeading title='Bookmarks' />
        <Posts feedType='bookmarks'/>
    </div>
  )
}

export default BookmarksPage