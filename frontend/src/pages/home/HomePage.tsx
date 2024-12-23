import React from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import Tabs from "../../components/ui/Tabs";
import { IoSend } from "react-icons/io5";
import Modal from "../../components/ui/Modal";
import PageHeading from "../../components/ui/PageHeading";

const HomePage = () => {
  const [feedType, setFeedType] = React.useState("forYou");
  const tabs = [
    { id: "forYou", label: "For You" },
    { id: "following", label: "Following" },
  ];
  return (
    <div className="flex flex-col w-full min-h-screen">
      <PageHeading headerMobile title/>
      <Tabs activeTab={feedType} setActiveTab={setFeedType} tabs={tabs} />
      <CreatePost className="hidden sm:flex " type="original" showAvatar />
      <Posts feedType={feedType} />
      <Modal
        modalName="create_post_model_2"
        className=""
        modalBoxClassName="p-0 py-2"
        trigger={
          <button
            type="button"
            className="absolute bottom-20 right-3 btn btn-primary font-bold rounded-full w-12 h-12 xs:hidden"
            role="button"
            onClick={() => {
              const modal = document.getElementById(
                "create_post_model_2"
              ) as HTMLDialogElement | null;
              modal?.showModal();
            }}
            title="Create Post"
          >
            <IoSend className="w-full h-full flex" />
          </button>
        }
      >
        <CreatePost className="flex" type="original" showAvatar modalName="create_post_model_2"/>
      </Modal>
    </div>
  );
};
export default HomePage;
