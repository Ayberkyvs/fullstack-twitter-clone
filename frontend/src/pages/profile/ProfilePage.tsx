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

const ProfilePage = () => {
  const [coverImg, setCoverImg] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);
  const [feedType, setFeedType] = React.useState("posts");
  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "likes", label: "Likes" },
  ];
  const coverImgRef = React.useRef(null);
  const profileImgRef = React.useRef(null);

  const isLoading = false;
  const isMyProfile = true;

  const user = {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "https://avatar.iran.liara.run/public",
    coverImg: "https://picsum.photos/200/300",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: "https://youtube.com/@asaprogrammer_",
    following: ["1", "2", "3"],
    followers: ["1", "2", "3"],
    createdAt: "2024-11-28T17:12:39.022+00:00",
  };

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
      {isLoading && <ProfileHeaderSkeleton />}
      {!isLoading && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      <section className="flex flex-col">
        {!isLoading && user && (
          <>
            <PageHeading
              title={user?.fullName}
              subtitle={`${POSTS?.length} posts`}
            />
            {/* COVER IMG */}
            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || "/cover.png"}
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
                    src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                    alt="Profile Avatar"
                  />
                  <div className="absolute top-5 right-5 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                    {isMyProfile && (
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && <EditProfileModal profileData={user} />}
              {!isMyProfile && (
                <button
                  className="btn btn-outline rounded-full btn-sm"
                  onClick={() => alert("Followed successfully")}
                  type="button"
                >
                  Follow
                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  className="btn btn-primary rounded-full btn-sm text-base-content px-4 ml-2"
                  onClick={() => alert("Profile updated successfully")}
                  type="button"
                >
                  Update
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-8 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-xl">{user?.fullName}</span>
                <span className="text-base text-neutral">
                  @{user?.username}
                </span>
                <span className="text-base my-1">{user?.bio}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?.link && (
                  <div className="flex gap-1 items-center ">
                    <>
                      <FaLink className="w-3 h-3 text-neutral" />
                      <a
                        href="https://youtube.com/@asaprogrammer_"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        youtube.com/@asaprogrammer_
                      </a>
                    </>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-neutral">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.following.length}
                  </span>
                  <span className="text-neutral text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.followers.length}
                  </span>
                  <span className="text-neutral text-xs">Followers</span>
                </div>
              </div>
            </div>
            <Tabs
              tabs={tabs}
              activeTab={feedType}
              setActiveTab={setFeedType}
              className="mt-4"
            />
            <Posts feedType={feedType} />
          </>
        )}
      </section>
    </>
  );
};

export default ProfilePage;
