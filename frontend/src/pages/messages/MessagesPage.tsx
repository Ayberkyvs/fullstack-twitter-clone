import PageHeading from '../../components/ui/PageHeading'
import NotFound from '../../components/common/NotFound';

const MessagesPage = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
        <PageHeading title="Messages" headerMobile className='border-b border-base-content/10 shadow-lg '/>
        <NotFound className="my-2" errorMessage="Maybe after learning websockets."/>
    </div>
  )
}

export default MessagesPage