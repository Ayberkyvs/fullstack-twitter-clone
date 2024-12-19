export type SignUpFormType = {
	email: string;
	username: string;
	fullName: string;
	password: string;
}

export type UserType = {
	_id: string;
	fullName: string;
	username: string;
	email: string;
	bio: string | null;
	link: string | null;
	badge?: string;
	profileImg: string;
	createdAt: string;
	likedPosts: string[];
	followers: string[];
	following: string[];
	repostedPosts: RepostedPost[];
};

export type PostType = {
	_id: string;
	text?: string;
	img?: string;
	user: UserType;
	parentPost?: PostType;
	childPosts?: PostType[];
	type: "original" | "reply" | "repost";
	likes: object[];
	replyCount: number;
	likeCount: number;
	repostCount: number;
	createdAt: string;
	repostedBy?: UserType;
};

export type RepostedPost = Pick<PostType, "_id" | "user" | "createdAt">;

export type HashtagType = {
	_id: string;
	tag: string;
	usageCount: number;
}

export type NotificationType = {
	from: string;
	to: string;
	postId?: string;
	replyContext: string;
	type: "like" | "reply" | "follow" | "repost";
	read: boolean;
	createdAt: string;
}

export type MenuItemsType = {
    [key: string]: {
        icon: JSX.Element;
		activeIcon: JSX.Element;
        text: string;
		link: string;
		inDock: boolean;
    };
};
