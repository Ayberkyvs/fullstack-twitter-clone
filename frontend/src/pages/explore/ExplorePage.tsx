import React from 'react'
import Tabs from '../../components/ui/Tabs'
import Explore from '../../components/ui/Explore';
import { useLocation } from 'react-router-dom';
import PageHeading from '../../components/ui/PageHeading';

const ExplorePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab') === "suggested" ? "suggested" : "trending";

    const [exploreType, setExploreType] = React.useState<"trending" | "suggested">("trending");
    const tabs = [
        { id: "trending", label: "Trending" },
        { id: "suggested", label: "You might like" },
    ];

  React.useEffect(() => {
    setExploreType(tab);
  }, [location]);
  return (
    <div className='flex flex-col w-full min-h-screen'>
        <PageHeading headerMobile title/>
        <Tabs activeTab={exploreType} setActiveTab={setExploreType} tabs={tabs}/>
        <div className={`flex flex-col ${exploreType === "trending" ? "" : "p-4 gap-2"}`}>
          <Explore exploreType={exploreType} className={`${exploreType === "trending" ? "p-5 gap-5" : "gap-5"}`} limit={20}/>
        </div>
    </div>
  )
}

export default ExplorePage