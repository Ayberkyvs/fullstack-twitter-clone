import HashtagSkeleton from "../skeletons/HashtagSkeleton";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import User from "./User";
import React from "react";
import useFollow from "../hooks/useFollow";
import { HashtagType, UserType } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";
import LoadingSpinner from "../common/LoadingSpinner";
const Explore = ({
  exploreType,
  className,
  limit,
  showBio
}: {
  exploreType: "suggested" | "trending";
  className?: string;
  limit: number;
  showBio?: boolean;
}) => {
  const getSectionContent = () => {
    switch (exploreType) {
      case "suggested":
        return "/api/users/suggested";
      case "trending":
        return "/api/hashtags/all";
      default:
        return "/api/users/suggested";
    }
  };
  const HIGHLIGHT_ENDPOINT = getSectionContent();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`${exploreType}`],
    queryFn: async () => {
      try {
        const res = await fetch(HIGHLIGHT_ENDPOINT, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "An error occurred while fetching.");
        return data;
      } catch (error: Error | any) {
        console.error(error.message);
        throw error;
      }
    },
    retry: 1,
  });

  React.useEffect(() => {
    refetch();
  }, [exploreType, refetch]);

  const { follow, isPending: isFollowPending } = useFollow();
  //! Burada hata var herkese pending
  return (
    <div className={`flex flex-col ${className}`}>
      {isError && <p className="text-base-content text-sm">{error?.message}</p>}
      {isLoading &&
        Array.from({ length: 6 }).map((_, index) => {
          return exploreType === "suggested" ? (
            <RightPanelSkeleton key={index} />
          ) : (
            <HashtagSkeleton key={index} />
          );
        })}
      {!isLoading &&
        !isError &&
        data?.slice(0, limit).map((item: UserType | HashtagType) => {
          return exploreType === "suggested" ? (
            <User
              key={uuidv4()}
              user={item as UserType}
              showBio={showBio}
              rightButton={
                <button
                  className="btn btn-primary rounded-full btn-sm"
                  onClick={() => follow((item as UserType)._id)}
                  type="button"
                >
                  {isFollowPending ? (
                    <LoadingSpinner
                      size="sm"
                      className="text-primary-content"
                    />
                  ) : (
                    "Follow"
                  )}
                </button>
              }
            />
          ) : (
            <div className="flex flex-col w-full h-fit" key={uuidv4()}>
              <h6 className="text-base font-bold">
                #{(item as HashtagType).tag}
              </h6>
              <span className="text-sm text-neutral">
                {(item as HashtagType).usageCount} posts
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default Explore;
