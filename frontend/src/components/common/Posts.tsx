import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";

const Posts = ({feedType}: {feedType?: string}) => {
	const isLoading = false;

	return (
		<>
		<div className='flex flex-col justify-center'>
			{isLoading &&
				Array.from({ length: 4 }).map((_, index) => (
					<PostSkeleton key={index} />
				))
			}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && POSTS.map((post: any) => (
				<Post key={post._id} post={post} />
			))}
		</div>
		</>
	);
};
export default Posts;