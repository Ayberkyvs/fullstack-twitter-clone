import React from "react";
import PageHeading from "../../components/ui/PageHeading";
import { POSTS } from "../../utils/db/dummy";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "../../components/ui/EditProfileModal";
import { MdEdit } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import Tabs from "../../components/ui/Tabs";
import { formatDate } from "../../utils/formatDate";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "../../utils/types";
import useUpdateUserProfile from "../../components/hooks/useUpdateUserProfile";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useFollow from "../../components/hooks/useFollow";
import findBadge from "../../utils/findBadge";

const ProfilePage = () => {
  const params = useParams();
  const username:string = params?.username ?? "a";

  const [coverImg, setCoverImg] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);
  const [feedType, setFeedType] = React.useState("posts");

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "likes", label: "Likes" },
  ];

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const {
    data: user,
    isPending: isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error: Error | any) {
        throw new Error(error.message);
      }
    },
  });

  console.log("user", user);
  React.useEffect(() => {
    refetchUser();
  }, [username, refetchUser]);

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();
  const { follow, isPending: isFollowPending } = useFollow();

  const coverImgRef = React.useRef(null);
  const profileImgRef = React.useRef(null);
  const isMyProfile = authUser?._id === user?._id;
  const isFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: "coverImg" | "profileImg"
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {isLoading && isUpdatingProfile && <ProfileHeaderSkeleton />}
      {!isLoading && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      <section className="flex flex-col">
        {!isLoading && user && (
          <>
            <PageHeading
              title={<h1 className="flex w-fit gap-1 font-bold text-xl">{user?.fullName} {user?.badge && findBadge(user?.badge)}</h1>}
              subtitle={`${POSTS?.length} posts`}
              headerMobile={false}
            />
            {/* COVER IMG */}
            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || "/cover.webp"}
                className="w-full h-52 object-cover"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-base-200 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-base-content" />
                </div>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              {/* USER AVATAR */}
              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar">
                  <img
                    src={
                      profileImg ||
                      user?.profileImg ||
                      "/avatar-placeholder.png"
                    }
                    alt="Profile Avatar"
                  />
                  {isMyProfile && (<div className="absolute top-5 right-5 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                  </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && authUser && (
                <EditProfileModal authUser={authUser} />
              )}
              {!isMyProfile && (
                <button
                  className="btn btn-primary rounded-full btn-sm"
                  onClick={() => follow(user?._id)}
                  type="button"
                >
                  {isFollowPending ? <LoadingSpinner size="lg" className="text-primary-content mx-2"/> : isFollowing ? "Unfollow" : "Follow"}

                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  className="btn btn-primary rounded-full btn-sm text-base-content px-4 ml-2"
                  onClick={async () => {
                    await updateProfile({ coverImg, profileImg });
                    setProfileImg(null);
                    setCoverImg(null);
                  }}
                  type="button"
                >
                  {isUpdatingProfile ? <LoadingSpinner size="lg" className="text-primary-content" /> : "Update"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-8 px-4">
              <div className="flex flex-col">
                <span className="flex w-fit gap-1 font-bold text-xl">{user?.fullName} {findBadge(user?.badge)}</span>
                <span className="text-base text-neutral">
                  @{user?.username}
                </span>
                <span className="text-base my-1">
                  {user?.bio ||
                    "This is the placeholder text. You can change it!"}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1 items-center ">
                  <>
                    <FaLink className="w-3 h-3 text-neutral" />
                    <a
                      href={user?.link || "https://ayberkyavas.com"}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {user?.link || "https://ayberkyavas.com"}
                    </a>
                  </>
                </div>
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-neutral" />
                  <span className="text-sm text-neutral">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={'following'} className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.following.length}
                  </span>
                  <span className="text-neutral text-xs">Following</span>
                </Link>
                <Link to={'followers'} className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.followers.length}
                  </span>
                  <span className="text-neutral text-xs">Followers</span>
                </Link>
              </div>
            </div>
            <Tabs
              tabs={tabs}
              activeTab={feedType}
              setActiveTab={setFeedType}
              className="mt-4"
            />
            <Posts
              feedType={feedType}
              username={user?.username}
              userId={user?._id}
            />
          </>
        )}
      </section>
    </>
  );
};

export default ProfilePage;
