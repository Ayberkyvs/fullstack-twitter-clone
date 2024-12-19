import React from "react";
import PageHeading from "../../components/ui/PageHeading";
import Tabs from "../../components/ui/Tabs";
import { UserType } from "../../utils/types";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import useFollow from "../../components/hooks/useFollow";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import User from "../../components/ui/User";
import NotFound from "../../components/common/NotFound";
import findBadge from "../../utils/findBadge";

const FollowersFollowing = () => {
  const userTypePath = window.location.pathname.split("/")[2]; // URL'den userType alınıyor
  const username = window.location.pathname.split("/")[1]; // URL'den username alınıyor
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const {
    data: user,
    refetch: userRefetch,
    isPending,
    isRefetching,
  } = useQuery<UserType>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const [userType, setUserType] = React.useState(userTypePath);
  const { follow, isPending: isFollowPending } = useFollow();

  const tabs = [
    { id: "followers", label: "Followers" },
    { id: "following", label: "Following" },
  ];

  const users = userType === "followers" ? user?.followers : user?.following;

  React.useEffect(() => {
    setUserType(userTypePath);
    userRefetch();
  }, [username, userTypePath, userRefetch]);

  return (
    <div className="flex flex-col w-full ">
      <PageHeading
        title={<h1 className="flex w-fit gap-1 font-bold text-xl">{user?.fullName} {user?.badge && findBadge(user?.badge)}</h1>}
        subtitle={`${users?.length ?? 0} ${userType}`}
        headerMobile={false}
      />
      <Tabs activeTab={userType} setActiveTab={setUserType} tabs={tabs} />
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        {(isPending || isRefetching) && <LoadingSpinner size="lg" />}
        {users && users.length > 0 && !isPending && !isRefetching
          ? users.map((user: any) => {
              const isFollowing =
                authUser?.following.includes(user._id) ?? false;
              return (
                <User
                  key={uuidv4()}
                  user={user}
                  rightButton={
                    <button
                      className="btn btn-primary rounded-full btn-sm"
                      onClick={() => follow(user._id)}
                      type="button"
                    >
                      {isFollowPending ? (
                        <LoadingSpinner
                          size="sm"
                          className="text-primary-content"
                        />
                      ) : isFollowing ? (
                        "Unfollow"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  }
                />
              );
            })
          : !isPending &&
            !isRefetching && (
              <NotFound className="my-2" errorMessage="No Users Found, Let's explore new people! 🙂" />
            )}
      </div>
    </div>
  );
};

export default FollowersFollowing;
