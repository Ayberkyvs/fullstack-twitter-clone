import React from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import Tabs from "../../components/ui/Tabs";
import { IoSend } from "react-icons/io5";
import Modal from "../../components/ui/Modal";


const HomePage = () => {
    const [feedType, setFeedType] = React.useState("forYou");
    const tabs = [
        { id: "forYou", label: "For You" },
        { id: "following", label: "Following" },
    ];
    return (
        <div className='flex flex-col w-full min-h-screen'>
            <Tabs activeTab={feedType} setActiveTab={setFeedType} tabs={tabs}/>
            <CreatePost className="hidden sm:flex "/>
            <Posts feedType={feedType}/>
            <Modal modalName="create_post_model_2" className="xs:hidden">
                <label className="absolute bottom-20 right-3 btn btn-primary font-bold rounded-full w-12 h-12" role="button" htmlFor="create_post_model_2" title="Create Post"><IoSend className="w-full h-full flex"/></label>
            </Modal>
        </div>
    );
};
export default HomePage;