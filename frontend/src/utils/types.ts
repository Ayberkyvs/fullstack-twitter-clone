export type SignUpFormType = {
	email: string;
	username: string;
	fullName: string;
	password: string;
}

type repostedPost = {
	post: string;
	createdAt: string;
	updatedAt: string;
}
export type UserType = {
	_id: string;
	fullName: string;
	username: string;
	profileImg: string;
	createdAt: string;
	likedPosts: string[];
	followers: string[];
	following: string[];
	repostedPosts: repostedPost[];
};

export type PostType = {
	_id: string;
	text?: string;
	img?: string;
	user: UserType;
	parentPost?: PostType;
	type: "original" | "reply";
	comments: {
		_id: string;
		text: string;
		user: UserType;
	}[];
	likes: object[];
	replyCount: number;
	likeCount: number;
	repostCount: number;
	createdAt: string;
	repostedBy?: UserType;
};

export type HashtagType = {
	_id: string;
	tag: string;
	usageCount: number;
}

export type NotificationType = {
	from: string;
	to: string;
	type: "like" | "comment" | "follow" | "reply";
	read: boolean;
	createdAt: string;
}

export type MenuItems = {
    [key: string]: {
        icon: JSX.Element;
		activeIcon: JSX.Element;
        text: string;
		link: string;
		inDock: boolean;
    };
};
