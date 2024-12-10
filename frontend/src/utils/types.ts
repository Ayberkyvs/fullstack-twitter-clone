export type SignUpFormType = {
	email: string;
	username: string;
	fullName: string;
	password: string;
}

export type UserType = {
	_id?: string;
	fullName: string;
	username: string;
	profileImg: string;
	createdAt: string;
};

export type PostType = {
	_id: string;
	text: string;
	img?: string;
	user: UserType;
	comments: {
		_id: string;
		text: string;
		user: UserType;
	}[];
	likes: string[];
	commentCount: number;
	likeCount: number;
	retweetCount: number;
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
