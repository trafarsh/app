# Glimpse: an Instagram-style social app

A full-featured photo and video sharing app for Android, iOS and web. It's built with **React Native + Expo** and closely follows the look and feel of Instagram's mobile app. This is a portfolio project: it isn't affiliated with Instagram or Meta, and it uses its own name and logo.

## Features

| Area | What works |
|------|------------|
| **Auth** | Sign up, log in, log out, a demo account (`alex.codes` / `password`), and per-user data |
| **Feed** | Stories bar, image carousels with dots and a 1/3 counter, double-tap to like (animated heart), like, comment, share to DMs, save, a post options sheet (delete, unfollow), and pull to refresh |
| **Stories** | Full-screen viewer with timed progress bars, tap left/right, hold to pause, swipe down to close, auto-advance to the next person, reply by DM, and posting your own story from the gallery |
| **Reels** | Vertical full-screen video paging, autoplay and loop, tap to mute, double-tap to like, follow, comments, and a black tab bar like the real app |
| **Explore** | Mixed grid with tall reel tiles, plus user search with follower counts |
| **Create** | New post (multiple photos, caption, location), story, or reel from the gallery or camera |
| **Profile** | Stats, bio, link, highlights, posts/reels/tagged tabs, a 3:4 grid, edit profile (photo, name, username, bio), and followers/following lists |
| **Other profiles** | Follow / Following (with an unfollow sheet), Message, and "Follows you" |
| **Direct messages** | Inbox with notes and unread badges, chat with gradient bubbles, double-tap heart reactions, shared posts, and a typing indicator with simulated replies |
| **Notifications** | Likes, comments, mentions and follows grouped by Today / This week / This month, with Follow back |
| **Settings** | Saved posts, light/dark/system appearance, reset demo data, log out |

All data is stored on the device with Zustand + AsyncStorage, so everything you do survives an app restart.

## Tech stack

- **Expo SDK 57** / React Native 0.86 / React 19 / TypeScript (strict)
- **Expo Router** for file-based navigation (tabs, stacks, modals, protected routes)
- **Zustand** + AsyncStorage for state and persistence
- **Reanimated 4** for the like/heart animations
- **expo-video** (reels), **expo-image** (cached images), **expo-image-picker** (gallery/camera), **expo-video-thumbnails**
- **react-native-svg** for custom icons, **expo-linear-gradient** for story rings and DM bubbles
- ESLint (`eslint-config-expo`) and TypeScript checks
- **GitHub Actions** builds a release APK on every push (`.github/workflows/android-apk.yml`)

## Project structure

```
src/
  app/                 # screens (Expo Router)
    (tabs)/            # home feed, explore, reels, profile (+ the "new" tab)
    story/[userId]     # story viewer
    comments/[id]      # comments for posts and reels
    messages/          # inbox and chat
    user/[username]    # other people's profiles
    ...                # create, activity, settings, saved, edit-profile, follows
  components/          # PostCard, StoriesBar, ProfileView, PostGrid, icons, UI kit
  store/               # Zustand store: auth, posts, likes, follows, chats...
  data/                # types and seed data (demo users, posts, reels, chats)
  theme/               # light/dark colour tokens
```

## Run it locally

```bash
cd glimpse
npm install
npx expo start          # scan the QR code with a development build, or press w for web
npx expo run:android    # build and run on a connected device or emulator (needs Android Studio)
```

## Get the APK

Every push that changes `glimpse/` runs the **Build Android APK** workflow. When it finishes:

1. Open the repository's **Releases** page and download `Glimpse.apk` from the newest release. The APK is also attached to the workflow run as an artifact.
2. Open the file on your Android phone and allow **Install unknown apps** when asked.

Photos, avatars and reel videos load from free sample services (picsum.photos, pravatar.cc and Google's sample videos), so the app needs an internet connection.
