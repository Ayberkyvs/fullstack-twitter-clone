import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import {USERS_FOR_RIGHT_PANEL, HASHTAGS} from "../../utils/db/dummy";
import { AUTH_USER } from "../../utils/db/dummy";;
import User from "../ui/User";
import Search from "../ui/Search";
import HighlightsSection from "../ui/HighlightsSection";
import HashtagSkeleton from "../skeletons/HashtagSkeleton";
import CurrentUser from "../ui/CurrentUser";

const RightPanel = () => {
	const isLoading = false;
    return (
	<section className='hidden lg:flex flex-col px-3 py-5 gap-5 border-l border-base-content/10'>
		<CurrentUser />
		<Search />
		<HighlightsSection title="Live on Twitter"
		content={
			isLoading ? <RightPanelSkeleton />
			:
			<User
				user={AUTH_USER}
				rightButton={
					<button
						title="Follow"
						type="button"
						className="btn btn-xs hover:bg-base-content/60 bg-base-content text-base-100 w-fit h-[40px] px-4 py-0 text-base font-bold rounded-full">Follow
					</button>
				}
			/>
		} />
		<HighlightsSection title="You might like"
		content={
			<div className="flex flex-col gap-5">
				{isLoading &&
					Array.from({ length: 4 }).map((_, index) => (
						<RightPanelSkeleton key={index} />
					))
				}
				{!isLoading && USERS_FOR_RIGHT_PANEL.slice(0, 4).map(user => (
					<User
						key={user.username}
						user={user}
						rightButton={
							<button
								title="Follow"
								type="button"
								className="btn btn-xs hover:bg-base-content/60 bg-base-content text-base-100 w-fit h-[40px] px-4 text-base font-bold rounded-full">Follow
							</button>
						}
					/>
				))}
			</div>
		} />
		<HighlightsSection title="What's happening"
		content={
			<div className="flex flex-col gap-5">
				{isLoading &&
					Array.from({ length: 8 }).map((_, index) => (
						<HashtagSkeleton key={index} />
					))
				}
				{!isLoading && HASHTAGS.slice(0, 9).map(hashtag => (
					<div className="flex flex-col w-full h-fit">
						<h6 className="text-base font-bold">{hashtag.tag}</h6>
						<span className="text-sm text-neutral">{hashtag.usageCount} posts</span>
					</div>
				))}
			</div>
		} />

	</section>
    );
};
export default RightPanel;