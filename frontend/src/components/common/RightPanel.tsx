import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import {USERS_FOR_RIGHT_PANEL, HASHTAGS} from "../../utils/db/dummy";
import { AUTH_USER } from "../../utils/db/dummy";
import { BsThreeDots } from "react-icons/bs";
import User from "../ui/User";
import Search from "../ui/Search";
import HighlightsSection from "../ui/HighlightsSection";
import HashtagSkeleton from "../skeletons/HashtagSkeleton";

const RightPanel = () => {
	const isLoading = true;
    return (
	<section className='hidden lg:flex flex-col px-3 py-5 gap-5 border-l border-base-content/10'>
		<User user={AUTH_USER} rightButton={<button title="More" type="button" className="text-lg text-neutral"><BsThreeDots/></button>} />
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
				{USERS_FOR_RIGHT_PANEL.slice(0, 4).map(user => (
					isLoading ? <RightPanelSkeleton />
					:
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
				{HASHTAGS.slice(0, 9).map(hashtag => (
					isLoading ? <HashtagSkeleton />
					:
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