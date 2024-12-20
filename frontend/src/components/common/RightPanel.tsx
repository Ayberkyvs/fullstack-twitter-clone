import Search from "../ui/Search";
import HighlightsSection from "../ui/HighlightsSection";
import CurrentUser from "../ui/CurrentUser";
import Explore from "../ui/Explore";
import { Link } from "react-router-dom";

const RightPanel = () => {
    return (
	<section className='hidden lg:flex w-full h-full flex-col px-3 py-5 gap-5 border-l border-base-content/10'>
		<CurrentUser />
		<Search />
		{/* <HighlightsSection title="Live on Twitter"
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
		} /> */}
		<HighlightsSection title="You might like" className="p-4">
			<Explore exploreType="suggested" className="gap-5" limit={5}/>
			<Link to="/explore?tab=suggested" className="link link-primary text-base mt-2">Show More</Link>
		</HighlightsSection>
		<HighlightsSection title="What's happening" className="p-4">
			<Explore exploreType="trending" limit={5} className="gap-5"/>
			<Link to="/explore?tab=trending" className="link link-primary text-base mt-2">Show More</Link>
		</HighlightsSection>
	</section>
    );
};
export default RightPanel;