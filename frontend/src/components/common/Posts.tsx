import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Posts = ({feedType}: {feedType?: string}) => {
	const getPostsEndPoint = () =>{
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "bookmarks":
				return "";
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostsEndPoint();
	const {data: posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts", POST_ENDPOINT],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT, {
					method: "GET",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "An error occurred while fetching posts");
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		}
	});

	React.useEffect(() => {
		refetch();
	},[feedType, refetch]);
	return (
		<>
		<div className='flex flex-col justify-center'>
			{(isLoading || isRefetching) &&
				Array.from({ length: 4 }).map((_, index) => (
					<PostSkeleton key={index} />
				))
			}
			{(!isLoading && !isRefetching) && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{(!isLoading && !isRefetching) && posts && posts.map((post: any) => (
				<Post key={post._id} post={post} />
			))}
		</div>
		</>
	);
};
export default Posts;