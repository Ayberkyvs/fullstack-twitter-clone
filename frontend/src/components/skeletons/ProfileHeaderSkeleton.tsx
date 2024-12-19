import PageHeading from "../ui/PageHeading";
import PostSkeleton from "./PostSkeleton";

const ProfileHeaderSkeleton = () => {
	return (
		<>
		<PageHeading title={<div className="skeleton w-24 h-5"></div>} subtitle={<div className="skeleton w-14 h-3"></div>} headerMobile={false} />
		<div className='flex flex-col w-full border-b border-base-content/10 pb-4'>
			<div className='flex gap-2 items-center'>
				<div className='flex flex-1 gap-1'>
					<div className='flex flex-col gap-1 w-full '>
						<div className='skeleton h-52 w-full relative rounded-none'>
							<div className='skeleton h-32 w-32 rounded-full border border-base-content/10 absolute -bottom-10 left-3'></div>
						</div>
						<div className='skeleton h-8 mt-4 w-24 ml-auto mr-2 rounded-full'></div>
						<div className="flex flex-col gap-2 pl-6">
							<div className='skeleton h-6 w-24 rounded-full mt-4'></div>
							<div className='skeleton h-4 w-16 rounded-full'></div>
							<div className='skeleton h-4 w-2/3 rounded-full'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<PostSkeleton />
		<PostSkeleton />
		</>
	);
};
export default ProfileHeaderSkeleton;