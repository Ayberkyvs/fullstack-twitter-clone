import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import NotFound from "./NotFound";

const Posts = ({feedType, username, userId}: {feedType: string, username?: string, userId?: string}) => {
	const getPostsEndPoint = () =>{
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "bookmarks":
				return "";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostsEndPoint();
	const {data: posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
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
		},
		refetchInterval: 1000 * 60 * 1,
	});

	React.useEffect(() => {
		refetch();
	},[feedType, refetch, username]);
	return (
	<div className='flex flex-col justify-center border-t border-base-content/10 '>
		{(isLoading || isRefetching) &&
			Array.from({ length: 3 }).map((_, index) => (
				<PostSkeleton key={index} />
			))
		}
		{(!isLoading && !isRefetching) && posts?.length === 0 && <NotFound className="my-4" errorMessage="No posts in this tab. Switch 👻"/> }
		{(!isLoading && !isRefetching) && posts && posts.map((post: any) => (
			<Post key={post._id.toString()} post={post} />
		))}
	</div>
	);
};
export default Posts;