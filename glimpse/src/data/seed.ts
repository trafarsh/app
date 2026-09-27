import type { Account, Chat, Notification, Post, Reel, Story, User } from './types';

export const ME = 'u0';

const img = (seed: string, w = 1080, h = 1080) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const avatar = (n: number) => `https://i.pravatar.cc/300?img=${n}`;
const VIDEO_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';

const M = 60_000;
const H = 60 * M;
const D = 24 * H;

function makeUsers(): User[] {
  const u = (
    id: string,
    username: string,
    name: string,
    av: number,
    bio: string,
    baseFollowers: number,
    following: string[],
    extra: Partial<User> = {},
  ): User => ({ id, username, name, avatar: avatar(av), bio, baseFollowers, following, ...extra });

  return [
    u('u0', 'alex.codes', 'Alex Rivera', 12, 'Software engineer 💻\nCoffee, code & long walks 📍 Lisbon', 842, ['u1', 'u2', 'u3', 'u4', 'u6', 'u8', 'u9'], {
      website: 'github.com/alex-codes',
      highlights: [
        { id: 'h1', title: 'Travel', cover: img('hl-travel', 300, 300) },
        { id: 'h2', title: 'Food', cover: img('hl-food', 300, 300) },
        { id: 'h3', title: 'Setup', cover: img('hl-setup', 300, 300) },
      ],
    }),
    u('u1', 'mia.travels', 'Mia Chen', 5, '✈️ 42 countries & counting\nTravel tips & hidden gems 🌍', 128_400, ['u0', 'u3', 'u9'], {
      verified: true,
      website: 'miatravels.blog',
      highlights: [
        { id: 'h4', title: 'Japan', cover: img('hl-japan', 300, 300) },
        { id: 'h5', title: 'Iceland', cover: img('hl-iceland', 300, 300) },
      ],
    }),
    u('u2', 'chef.leo', 'Leo Martins', 13, 'Home cook 🍝 Simple recipes, big flavour\nNew recipe every Sunday', 54_210, ['u0', 'u7']),
    u('u3', 'urban.lens', 'Sam Okafor', 15, '📷 Street & architecture photography\nPrints available ↓', 312_000, ['u1'], { verified: true, website: 'urbanlens.studio' }),
    u('u4', 'fitwithpriya', 'Priya Nair', 9, 'Certified PT 🏋️‍♀️\nHome workouts • Healthy habits', 88_700, ['u0']),
    u('u5', 'daily.dose.of.art', 'Ava Rossi', 16, 'Painting every day 🎨\nCommissions open', 23_900, ['u3']),
    u('u6', 'techwithtom', 'Tom Becker', 11, 'Gadgets, desk setups & tech news ⚡️', 501_000, ['u0', 'u12'], { verified: true }),
    u('u7', 'coffee.and.pages', 'Nora Lindqvist', 20, '☕️ + 📚 = ❤️\nBook reviews & cozy corners', 17_300, ['u2']),
    u('u8', 'wildpaws', 'Wild Paws', 32, 'The cutest animals on the internet 🐾', 1_240_000, [], { verified: true }),
    u('u9', 'kai.surfs', 'Kai Kahale', 33, '🌊 Surf • Sun • Salt\nHawaiʻi', 9_800, ['u0', 'u1']),
    u('u10', 'lena.styles', 'Lena Park', 25, 'Fashion & everyday outfits 👗', 64_500, ['u1']),
    u('u11', 'the.plant.room', 'Olivia Grant', 44, '🌿 187 plants and one tiny apartment', 41_000, ['u7']),
    u('u12', 'dev.ramirez', 'Diego Ramirez', 52, 'Frontend dev • Open source ❤️', 3_400, ['u0', 'u6']),
  ];
}

const CAPTIONS: [string, string, string?][] = [
  ['u1', 'Woke up to this view and never want to leave 🌅 #travel #wanderlust', 'Santorini, Greece'],
  ['u3', 'Lines, light and a little bit of luck. 📐', 'Tokyo, Japan'],
  ['u2', 'Sunday pasta is a non-negotiable 🍝 Recipe in comments!'],
  ['u8', 'Monday mood 😴🐾'],
  ['u6', 'The new desk setup is finally done ⚡️ What do you think?'],
  ['u4', '5 minutes a day is better than zero minutes a day 💪 #fitness'],
  ['u5', 'Day 214 of painting every day. This one took 6 hours 🎨'],
  ['u9', 'Glassy mornings 🌊🏄‍♂️', 'North Shore, Oʻahu'],
  ['u7', 'Current read + the perfect latte ☕️📚'],
  ['u10', 'Autumn layers 🍂 #ootd'],
  ['u11', 'New baby just arrived 🌱 Say hi to Monstera #3'],
  ['u1', 'Getting lost in the old town streets 🧡', 'Lisbon, Portugal'],
  ['u3', 'Rainy nights in the city ☔️'],
  ['u12', 'Shipped my first open source library today 🚀 Link in bio!'],
  ['u8', 'He really said “no photos please” 😂'],
  ['u2', 'Homemade sourdough, attempt #27. We are getting there 🍞'],
  ['u0', 'Weekend project: rebuilt my portfolio from scratch 👨‍💻', 'Lisbon, Portugal'],
  ['u0', 'Best coffee in town, fight me ☕️'],
  ['u0', 'Sunsets > everything'],
  ['u6', 'Unboxing tomorrow 👀 Guess what it is'],
  ['u4', 'Rest days are part of the plan too 🧘‍♀️'],
  ['u9', 'Golden hour session 🌇'],
  ['u5', 'Work in progress 🖌️'],
  ['u10', 'Weekend in the city 🖤'],
  ['u1', 'Northern lights, finally ✨', 'Reykjavík, Iceland'],
  ['u11', 'Sunday plant care routine 💧'],
  ['u7', 'Rainy day reading list 🌧️'],
  ['u3', 'Symmetry 🏛️'],
];

const COMMENT_TEXTS = [
  'This is incredible 😍',
  'Wow! 🔥🔥',
  'Need to go here ASAP',
  'Obsessed with this ❤️',
  'So good!!',
  'Where is this?',
  'Stunning shot 👏',
  'The colours 😮',
  '🙌🙌🙌',
  'Saving this for later',
  'Goals 😍',
  'Love it!',
];

function makePosts(): Post[] {
  const now = Date.now();
  return CAPTIONS.map(([userId, caption, location], i) => {
    const multi = i % 4 === 0;
    const portrait = i % 3 === 1;
    const w = 1080;
    const h = portrait ? 1350 : 1080;
    const images = multi
      ? [img(`p${i}a`, w, h), img(`p${i}b`, w, h), img(`p${i}c`, w, h)]
      : [img(`p${i}`, w, h)];
    const commenters = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u9', 'u10', 'u12'].filter((c) => c !== userId);
    const comments = Array.from({ length: (i % 4) + 1 }, (_, k) => ({
      id: `c${i}_${k}`,
      userId: commenters[(i + k * 3) % commenters.length],
      text: COMMENT_TEXTS[(i + k) % COMMENT_TEXTS.length],
      createdAt: now - (i * 3 + k + 1) * H * 0.8,
      likes: k === 0 ? ['u1', 'u3'] : [],
    }));
    return {
      id: `p${i}`,
      userId,
      images,
      aspect: w / h,
      caption,
      location,
      baseLikes: 120 + ((i * 7919) % 48_000),
      likes: i % 5 === 0 ? ['u1', 'u2'] : ['u3'],
      comments,
      createdAt: now - (i * 5 + 1) * H - (i % 3) * 17 * M,
    };
  });
}

const VIDEOS = [
  ['ForBiggerBlazes.mp4', 'u6', 'This changed how I work forever 🤯 #tech', 'techwithtom · Original audio'],
  ['ForBiggerEscapes.mp4', 'u1', 'POV: your weekend escape ✈️', 'mia.travels · Original audio'],
  ['ForBiggerJoyrides.mp4', 'u9', 'Send this to someone who needs a road trip 🚗', 'Summer Vibes · Chill Beats'],
  ['ForBiggerFun.mp4', 'u8', 'Wait for it… 😂🐾', 'wildpaws · Original audio'],
  ['ForBiggerMeltdowns.mp4', 'u12', 'Me when the build finally passes 😅', 'Dramatic Sound Effect'],
  ['SubaruOutbackOnStreetAndDirt.mp4', 'u3', 'Chasing light on the backroads 📷', 'urban.lens · Original audio'],
  ['WeAreGoingOnBullrun.mp4', 'u10', 'Road trip outfits check ✅', 'lena.styles · Original audio'],
  ['VolkswagenGTIReview.mp4', 'u6', 'Honest review, no sponsor 🚙', 'techwithtom · Original audio'],
] as const;

function makeReels(): Reel[] {
  const now = Date.now();
  return VIDEOS.map(([file, userId, caption, audio], i) => ({
    id: `r${i}`,
    userId,
    video: VIDEO_BASE + file,
    poster: img(`reel${i}`, 720, 1280),
    caption,
    audio,
    baseLikes: 1_200 + ((i * 104_729) % 380_000),
    likes: [],
    comments: [
      { id: `rc${i}_0`, userId: 'u2', text: COMMENT_TEXTS[i % COMMENT_TEXTS.length], createdAt: now - 3 * H, likes: [] },
      { id: `rc${i}_1`, userId: 'u4', text: COMMENT_TEXTS[(i + 5) % COMMENT_TEXTS.length], createdAt: now - 5 * H, likes: [] },
    ],
    views: 20_000 + ((i * 7_654_321) % 2_000_000),
    createdAt: now - (i + 1) * 9 * H,
  }));
}

function makeStories(): Story[] {
  const now = Date.now();
  return ['u1', 'u3', 'u2', 'u8', 'u6', 'u4', 'u9', 'u10', 'u5', 'u11'].map((userId, i) => ({
    userId,
    items: Array.from({ length: (i % 3) + 1 }, (_, k) => ({
      id: `s${i}_${k}`,
      image: img(`story${i}_${k}`, 1080, 1920),
      createdAt: now - (i + 1) * H - k * 20 * M,
    })),
  }));
}

function makeChats(): Chat[] {
  const now = Date.now();
  const chat = (id: string, userId: string, lines: [string, string, number][], unread = false): Chat => ({
    id,
    ownerId: ME,
    userId,
    unread,
    messages: lines.map(([from, text, ago], k) => ({ id: `${id}_${k}`, from, text, createdAt: now - ago })),
  });
  return [
    chat('ch1', 'u1', [
      ['u1', 'Hey! Are you still coming to Lisbon next month?', 2 * D],
      ['u0', 'Yes!! Can’t wait 😄', 2 * D - 30 * M],
      ['u1', 'Amazing, I’ll send you my list of spots', 2 * D - 25 * M],
      ['u1', 'Just posted a new reel, tell me what you think 👀', 12 * M],
    ], true),
    chat('ch2', 'u12', [
      ['u12', 'Did you see the new React release?', 5 * H],
      ['u0', 'Yeah, the compiler stuff is wild', 4 * H],
      ['u12', 'We should pair on something this weekend', 3 * H],
    ], true),
    chat('ch3', 'u2', [
      ['u0', 'That pasta looked insane', 1 * D],
      ['u2', 'Haha thanks! Recipe coming Sunday 🍝', 20 * H],
    ]),
    chat('ch4', 'u6', [
      ['u6', 'Thanks for the follow 🙌', 3 * D],
      ['u0', 'Love your setup videos!', 3 * D - H],
    ]),
    chat('ch5', 'u9', [['u9', 'Surf this weekend? 🌊', 6 * D]]),
  ];
}

function makeNotifications(): Notification[] {
  const now = Date.now();
  return [
    { id: 'n1', ownerId: ME, type: 'like', userId: 'u1', postId: 'p16', createdAt: now - 25 * M },
    { id: 'n2', ownerId: ME, type: 'follow', userId: 'u12', createdAt: now - 2 * H },
    { id: 'n3', ownerId: ME, type: 'comment', userId: 'u2', postId: 'p17', text: 'Where is this place? 😍', createdAt: now - 4 * H },
    { id: 'n4', ownerId: ME, type: 'like', userId: 'u6', postId: 'p18', createdAt: now - 9 * H },
    { id: 'n5', ownerId: ME, type: 'mention', userId: 'u9', postId: 'p7', text: '@alex.codes we need to go here', createdAt: now - 1.5 * D },
    { id: 'n6', ownerId: ME, type: 'follow', userId: 'u5', createdAt: now - 2 * D },
    { id: 'n7', ownerId: ME, type: 'like', userId: 'u4', postId: 'p16', createdAt: now - 3 * D },
    { id: 'n8', ownerId: ME, type: 'follow', userId: 'u11', createdAt: now - 9 * D },
    { id: 'n9', ownerId: ME, type: 'comment', userId: 'u3', postId: 'p18', text: 'Beautiful colours 🔥', createdAt: now - 12 * D },
    { id: 'n10', ownerId: ME, type: 'follow', userId: 'u7', createdAt: now - 20 * D },
  ];
}

export const DEMO_ACCOUNT: Account = { username: 'alex.codes', password: 'password', userId: ME };

export function makeSeed() {
  return {
    users: makeUsers(),
    posts: makePosts(),
    reels: makeReels(),
    stories: makeStories(),
    chats: makeChats(),
    notifications: makeNotifications(),
    accounts: [DEMO_ACCOUNT],
    saved: ['p1', 'p7'] as string[],
    seenStories: [] as string[],
  };
}

export const AUTO_REPLIES = [
  'Haha love that 😂',
  'Omg yes!!',
  'Sounds good 👍',
  'Wait really? 😮',
  'Let’s do it this weekend',
  '❤️',
  'I was literally just thinking about that',
  'Send me more pics!',
];
