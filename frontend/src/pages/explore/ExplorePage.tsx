import React from 'react'
import Tabs from '../../components/ui/Tabs'
import HashtagSkeleton from '../../components/skeletons/HashtagSkeleton';
import { HASHTAGS, USERS_FOR_RIGHT_PANEL } from '../../utils/db/dummy';
import RightPanelSkeleton from '../../components/skeletons/RightPanelSkeleton';
import User from '../../components/ui/User';

const ExplorePage = () => {
  const isLoading = false;
    const [exploreType, setExploreType] = React.useState("trending");
    const tabs = [
        { id: "trending", label: "Trending" },
        { id: "youMightLike", label: "You might like" },
    ];
  return (
    <div className='flex flex-col w-full min-h-screen'>
        <Tabs activeTab={exploreType} setActiveTab={setExploreType} tabs={tabs}/>
        <div className="flex flex-col gap-5 p-4">
        {exploreType === "trending" &&
				HASHTAGS.map(hashtag => (
					isLoading ? <HashtagSkeleton />
					:
					<div className="flex flex-col w-full h-fit">
						<h6 className="text-base font-bold">{hashtag.tag}</h6>
						<span className="text-sm text-neutral">{hashtag.usageCount} posts</span>
            </div>
          ))
        }
        {exploreType === "youMightLike" &&
          USERS_FOR_RIGHT_PANEL.map(user => (
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
          ))
        }
        </div>
    </div>
  )
}

export default ExplorePage