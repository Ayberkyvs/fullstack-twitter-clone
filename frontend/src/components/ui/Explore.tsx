import HashtagSkeleton from '../skeletons/HashtagSkeleton'
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton'
import { useQuery } from '@tanstack/react-query'
import User from './User'
import React from 'react'

const Explore = ({exploreType, className, limit}: {exploreType: "suggested" | "trending", className?:string, limit:number}) => {
const getSectionContent = () => {
    switch (exploreType) {
        case "suggested":
        return "/api/users/suggested";
        case "trending":
        return "/api/hashtags/all";
        default:
        return "/api/users/suggested";
    }
    }
    const HIGHLIGHT_ENDPOINT = getSectionContent();

    const {data, isLoading, isError, error, refetch} = useQuery({
        queryKey: [`${exploreType}`],
        queryFn: async () => {
            try {
                const res = await fetch(HIGHLIGHT_ENDPOINT, {
            method: "GET",
        });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "An error occurred while fetching.");
                return data;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        },
        retry: 1
    });

    React.useEffect(() => {
      refetch();
    },[exploreType, refetch]);

  return (
    <div className={`flex flex-col ${className}`}>
        {isError && <p className="text-base-content text-sm">{error?.message}</p>}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => {
            return exploreType === "suggested" ? <RightPanelSkeleton key={index} /> : <HashtagSkeleton key={index} />
          })
        }
        {!isLoading && !isError && data?.slice(0, limit).map(item => {
          return exploreType === "suggested" ?
          <User
            key={item.username}
            user={item}
            rightButton={
              <button
                title="Follow"
                type="button"
                className="btn btn-xs hover:bg-base-content/60 bg-base-content text-base-100 w-fit h-[40px] px-4 text-base font-bold rounded-full">Follow
              </button>
            }
          />
          :
          <div className="flex flex-col w-full h-fit p-3 hover:bg-base-200" key={item._id}>
            <h6 className="text-base font-bold">#{item.tag}</h6>
            <span className="text-sm text-neutral">{item.usageCount} posts</span>
          </div>
        })}
      </div>
  )
}

export default Explore