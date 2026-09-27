import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AUTO_REPLIES, makeSeed } from '@/data/seed';
import type { Chat, Comment, Post, Reel, User } from '@/data/types';
import { uid } from '@/utils/format';

type Appearance = 'system' | 'light' | 'dark';

type Data = ReturnType<typeof makeSeed>;

type State = Data & {
  hydrated: boolean;
  currentUserId: string | null;
  appearance: Appearance;
  /** Chat id → true while the other person is "typing". */
  typing: Record<string, boolean>;

  login: (username: string, password: string) => string | null;
  signup: (input: { username: string; name: string; password: string }) => string | null;
  logout: () => void;
  resetDemoData: () => void;
  setAppearance: (a: Appearance) => void;

  toggleLike: (postId: string) => void;
  likePost: (postId: string) => void;
  toggleReelLike: (reelId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (kind: 'post' | 'reel', id: string, text: string) => void;
  toggleCommentLike: (kind: 'post' | 'reel', id: string, commentId: string) => void;
  createPost: (input: { images: string[]; aspect: number; caption: string; location?: string }) => void;
  createReel: (input: { video: string; poster: string; caption: string }) => void;
  deletePost: (postId: string) => void;
  addStory: (image: string) => void;
  markStorySeen: (itemId: string) => void;
  toggleFollow: (userId: string) => void;
  removeFollower: (userId: string) => void;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'username' | 'bio' | 'website' | 'avatar'>>) => string | null;

  chatWith: (userId: string) => string;
  sendMessage: (chatId: string, text: string, postId?: string) => void;
  toggleMessageLike: (chatId: string, messageId: string) => void;
  markChatRead: (chatId: string) => void;
};

const mapPost = (posts: Post[], id: string, fn: (p: Post) => Post) => posts.map((p) => (p.id === id ? fn(p) : p));
const mapReel = (reels: Reel[], id: string, fn: (r: Reel) => Reel) => reels.map((r) => (r.id === id ? fn(r) : r));
const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const mapComments = (comments: Comment[], id: string, me: string) =>
  comments.map((c) => (c.id === id ? { ...c, likes: toggle(c.likes, me) } : c));

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const me = () => {
        const id = get().currentUserId;
        if (!id) throw new Error('Not logged in');
        return id;
      };

      return {
        ...makeSeed(),
        hydrated: false,
        currentUserId: null,
        appearance: 'system',
        typing: {},

        login: (username, password) => {
          const acc = get().accounts.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());
          if (!acc) return "The username you entered doesn't belong to an account. Please check your username and try again.";
          if (acc.password !== password) return 'Sorry, your password was incorrect. Please double-check your password.';
          set({ currentUserId: acc.userId });
          return null;
        },

        signup: ({ username, name, password }) => {
          const clean = username.trim().toLowerCase();
          if (!/^[a-z0-9._]{3,30}$/.test(clean)) return 'Usernames can only use letters, numbers, underscores and periods.';
          if (get().users.some((u) => u.username === clean)) return `The username ${clean} is not available.`;
          if (password.length < 6) return 'Create a password at least 6 characters long.';
          const id = uid('u');
          const user: User = {
            id,
            username: clean,
            name: name.trim(),
            avatar: '',
            bio: '',
            baseFollowers: 0,
            following: [],
          };
          set((s) => ({
            users: [...s.users, user],
            accounts: [...s.accounts, { username: clean, password, userId: id }],
            currentUserId: id,
          }));
          return null;
        },

        logout: () => set({ currentUserId: null }),

        resetDemoData: () => set({ ...makeSeed(), currentUserId: null, typing: {} }),

        setAppearance: (appearance) => set({ appearance }),

        toggleLike: (postId) => set((s) => ({ posts: mapPost(s.posts, postId, (p) => ({ ...p, likes: toggle(p.likes, me()) })) })),

        likePost: (postId) =>
          set((s) => ({
            posts: mapPost(s.posts, postId, (p) => (p.likes.includes(me()) ? p : { ...p, likes: [...p.likes, me()] })),
          })),

        toggleReelLike: (reelId) => set((s) => ({ reels: mapReel(s.reels, reelId, (r) => ({ ...r, likes: toggle(r.likes, me()) })) })),

        toggleSave: (postId) => set((s) => ({ saved: toggle(s.saved, postId) })),

        addComment: (kind, id, text) => {
          const comment: Comment = { id: uid('c'), userId: me(), text: text.trim(), createdAt: Date.now(), likes: [] };
          if (!comment.text) return;
          if (kind === 'post') set((s) => ({ posts: mapPost(s.posts, id, (p) => ({ ...p, comments: [...p.comments, comment] })) }));
          else set((s) => ({ reels: mapReel(s.reels, id, (r) => ({ ...r, comments: [...r.comments, comment] })) }));
        },

        toggleCommentLike: (kind, id, commentId) => {
          if (kind === 'post')
            set((s) => ({ posts: mapPost(s.posts, id, (p) => ({ ...p, comments: mapComments(p.comments, commentId, me()) })) }));
          else set((s) => ({ reels: mapReel(s.reels, id, (r) => ({ ...r, comments: mapComments(r.comments, commentId, me()) })) }));
        },

        createPost: ({ images, aspect, caption, location }) => {
          const post: Post = {
            id: uid('p'),
            userId: me(),
            images,
            aspect,
            caption: caption.trim(),
            location: location?.trim() || undefined,
            baseLikes: 0,
            likes: [],
            comments: [],
            createdAt: Date.now(),
          };
          set((s) => ({ posts: [post, ...s.posts] }));
        },

        createReel: ({ video, poster, caption }) => {
          const user = get().users.find((u) => u.id === me());
          const reel: Reel = {
            id: uid('r'),
            userId: me(),
            video,
            poster,
            caption: caption.trim(),
            audio: `${user?.username ?? 'you'} · Original audio`,
            baseLikes: 0,
            likes: [],
            comments: [],
            views: 0,
            createdAt: Date.now(),
          };
          set((s) => ({ reels: [reel, ...s.reels] }));
        },

        deletePost: (postId) => set((s) => ({ posts: s.posts.filter((p) => p.id !== postId), saved: s.saved.filter((x) => x !== postId) })),

        addStory: (image) => {
          const item = { id: uid('s'), image, createdAt: Date.now() };
          set((s) => {
            const existing = s.stories.find((st) => st.userId === me());
            const stories = existing
              ? s.stories.map((st) => (st.userId === me() ? { ...st, items: [...st.items, item] } : st))
              : [{ userId: me(), items: [item] }, ...s.stories];
            return { stories };
          });
        },

        markStorySeen: (itemId) => set((s) => (s.seenStories.includes(itemId) ? s : { seenStories: [...s.seenStories, itemId] })),

        toggleFollow: (userId) =>
          set((s) => ({ users: s.users.map((u) => (u.id === me() ? { ...u, following: toggle(u.following, userId) } : u)) })),

        removeFollower: (userId) =>
          set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, following: u.following.filter((x) => x !== me()) } : u)) })),

        updateProfile: (patch) => {
          if (patch.username !== undefined) {
            const clean = patch.username.trim().toLowerCase();
            if (!/^[a-z0-9._]{3,30}$/.test(clean)) return 'Usernames can only use letters, numbers, underscores and periods.';
            if (get().users.some((u) => u.username === clean && u.id !== me())) return `The username ${clean} is not available.`;
            patch = { ...patch, username: clean };
          }
          const id = me();
          // The account's login name follows the profile username.
          set((s) => ({
            users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
            accounts: s.accounts.map((a) => (a.userId === id && patch.username ? { ...a, username: patch.username } : a)),
          }));
          return null;
        },

        chatWith: (userId) => {
          const existing = get().chats.find((c) => c.ownerId === me() && c.userId === userId);
          if (existing) return existing.id;
          const chat: Chat = { id: uid('ch'), ownerId: me(), userId, messages: [] };
          set((s) => ({ chats: [chat, ...s.chats] }));
          return chat.id;
        },

        sendMessage: (chatId, text, postId) => {
          const from = me();
          const msg = { id: uid('m'), from, text: text.trim(), createdAt: Date.now(), postId };
          if (!msg.text && !postId) return;
          set((s) => ({ chats: s.chats.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c)) }));

          // Simulate the other person reading and replying.
          const chat = get().chats.find((c) => c.id === chatId);
          if (!chat) return;
          setTimeout(() => set((s) => ({ typing: { ...s.typing, [chatId]: true } })), 900);
          setTimeout(() => {
            const reply = {
              id: uid('m'),
              from: chat.userId,
              text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
              createdAt: Date.now(),
            };
            set((s) => ({
              typing: { ...s.typing, [chatId]: false },
              chats: s.chats.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, reply] } : c)),
            }));
          }, 2600);
        },

        toggleMessageLike: (chatId, messageId) =>
          set((s) => ({
            chats: s.chats.map((c) =>
              c.id === chatId ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, liked: !m.liked } : m)) } : c,
            ),
          })),

        markChatRead: (chatId) => set((s) => ({ chats: s.chats.map((c) => (c.id === chatId ? { ...c, unread: false } : c)) })),
      };
    },
    {
      name: 'glimpse-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, typing, ...rest }) => {
        // Functions are dropped by JSON serialisation; only data is persisted.
        void hydrated;
        void typing;
        return rest;
      },
      onRehydrateStorage: () => () => useStore.setState({ hydrated: true }),
    },
  ),
);

/* ---------- selectors / helpers ---------- */

export function useMe(): User {
  return useStore((s) => s.users.find((u) => u.id === s.currentUserId)!);
}

export function useUser(id: string | undefined): User | undefined {
  return useStore((s) => s.users.find((u) => u.id === id));
}

export function followerCount(users: User[], user: User): number {
  return user.baseFollowers + users.filter((u) => u.following.includes(user.id)).length;
}

/** Ring state for a user's avatar: gradient if they have unseen stories. */
export function useStoryRing(userId: string | undefined): 'none' | 'unseen' | 'seen' {
  return useStore((s) => {
    const story = s.stories.find((st) => st.userId === userId);
    if (!story || story.items.length === 0) return 'none';
    return story.items.every((i) => s.seenStories.includes(i.id)) ? 'seen' : 'unseen';
  });
}
