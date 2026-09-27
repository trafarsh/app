export type User = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  website?: string;
  verified?: boolean;
  /** Follower count from people outside the app's local data. */
  baseFollowers: number;
  following: string[];
  highlights?: { id: string; title: string; cover: string }[];
};

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
  likes: string[];
};

export type Post = {
  id: string;
  userId: string;
  images: string[];
  /** width / height of the media; 1 = square, 0.8 = 4:5 portrait. */
  aspect: number;
  caption: string;
  location?: string;
  baseLikes: number;
  likes: string[];
  comments: Comment[];
  createdAt: number;
};

export type Reel = {
  id: string;
  userId: string;
  video: string;
  poster: string;
  caption: string;
  audio: string;
  baseLikes: number;
  likes: string[];
  comments: Comment[];
  views: number;
  createdAt: number;
};

export type StoryItem = { id: string; image: string; createdAt: number };
export type Story = { userId: string; items: StoryItem[] };

export type Message = {
  id: string;
  from: string;
  text: string;
  createdAt: number;
  /** A post shared into the chat. */
  postId?: string;
  liked?: boolean;
};

export type Chat = { id: string; ownerId: string; userId: string; messages: Message[]; unread?: boolean };

export type Notification = {
  id: string;
  ownerId: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  userId: string;
  postId?: string;
  text?: string;
  createdAt: number;
};

export type Account = { username: string; password: string; userId: string };
