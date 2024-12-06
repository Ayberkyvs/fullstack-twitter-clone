import { PostType, UserType, HashtagType, NotificationType } from "../types";

export const AUTH_USER: UserType = {
	_id: "1",
	fullName: "John Doe",
	username: "johndoe",
	profileImg: "/avatars/male1.png",
	createdAt: "2024-11-28T17:12:39.022+00:00"
}

export const POSTS: PostType[] = [
	{
		_id: "1",
		text: "Let's build a fullstack WhatsApp clone with NEXT.JS 14 😍",
		img: "https://picsum.photos/700/1200",
		user: {
			username: "johndoe",
			profileImg: "/avatars/male1.png",
			fullName: "John Doe",
			createdAt: "2024-11-28T17:12:39.022+00:00"
		},
		comments: [
			{
				_id: "1",
				text: "Nice Tutorial",
				user: {
					username: "janedoe",
					profileImg: "/avatars/female1.png",
					fullName: "Jane Doe",
					createdAt: "2024-11-28T17:12:39.022+00:00"
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
		likeCount: 4,
		commentCount: 1,
		retweetCount: 0,
	},
	{
		_id: "2",
		text: "How you guys doing? 😊",
		user: {
			username: "johndoe",
			profileImg: "/avatars/male2.png",
			fullName: "John Doe",
			createdAt: "2024-11-28T17:12:39.022+00:00"
		},
		comments: [
			{
				_id: "1",
				text: "Nice Tutorial",
				user: {
					username: "janedoe",
					profileImg: "/avatars/female2.png",
					fullName: "Jane Doe",
					createdAt: "2024-11-28T17:12:39.022+00:00"
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
		likeCount: 4,
		commentCount: 3,
		retweetCount: 0,
	},
	{
		_id: "3",
		text: "Astronaut in a room of drawers, generated by Midjourney. 🚀",
		img: "/posts/post2.png",
		user: {
			username: "johndoe",
			profileImg: "/avatars/male3.png",
			fullName: "John Doe",
			createdAt: "2024-11-28T17:12:39.022+00:00"
		},
		comments: [],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896"],
		likeCount: 6,
		commentCount: 0,
		retweetCount: 1,
	},
	{
		_id: "4",
		text: "I'm learning GO this week. Any tips? 🤔",
		img: "/posts/post3.png",
		user: {
			username: "johndoe",
			profileImg: "/avatars/male3.png",
			fullName: "John Doe",
			createdAt: "2024-11-28T17:12:39.022+00:00"
		},
		comments: [
			{
				_id: "1",
				text: "Nice Tutorial",
				user: {
					username: "janedoe",
					profileImg: "/avatars/female3.png",
					fullName: "Jane Doe",
					createdAt: "2024-11-28T17:12:39.022+00:00"
				},
			},
		],
		likes: [
			"6658s891",
			"6658s892",
			"6658s893",
			"6658s894",
			"6658s895",
			"6658s896",
			"6658s897",
			"6658s898",
			"6658s899",
		],
		likeCount: 9,
		commentCount: 1,
		retweetCount: 0,
	},
];

export const USERS_FOR_RIGHT_PANEL: UserType[] = [
	{
		_id: "1",
		fullName: "John Doe",
		username: "johndoe",
		profileImg: "/avatars/male2.png",
		createdAt: "2024-11-28T17:12:39.022+00:00"
	},
	{
		_id: "2",
		fullName: "Jane Doe",
		username: "janedoe",
		profileImg: "/avatars/female1.png",
		createdAt: "2024-11-28T17:12:39.022+00:00"
	},
	{
		_id: "3",
		fullName: "Bob Doe",
		username: "bobdoe",
		profileImg: "/avatars/male3.png",
		createdAt: "2024-11-28T17:12:39.022+00:00"
	},
	{
		_id: "4",
		fullName: "Daisy Doe",
		username: "daisydoe",
		profileImg: "/avatars/female2.png",
		createdAt: "2024-11-28T17:12:39.022+00:00"
	},
];

export const HASHTAGS: HashtagType[] = [
{
	_id: "1",
	tag: "JavaScript",
	usageCount: 15230,
},
{
	_id: "2",
	tag: "ReactJS",
	usageCount: 12045,
},
{
	_id: "3",
	tag: "WebDevelopment",
	usageCount: 10320,
},
{
	_id: "4",
	tag: "Frontend",
	usageCount: 8570,
},
{
	_id: "5",
	tag: "TypeScript",
	usageCount: 7680,
},
{
	_id: "6",
	tag: "CodingLife",
	usageCount: 6540,
},
{
	_id: "7",
	tag: "DevCommunity",
	usageCount: 5420,
},
];

export const NOTIFICATIONS: NotificationType[] = [
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "follow",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "comment",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "follow",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "comment",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "follow",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "comment",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
	{
		from: "674a2980f5024e6beb06ec2d",
		to: "6748a48778cbdb934bb5d2d5",
		type: "like",
		read: false,
		createdAt: "2024-11-30T16:46:35.554+00:00",
	},
];