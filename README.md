# Vibe Social App

Vibe is a responsive social networking app built with React and TypeScript. Users can create posts, interact with the community, manage their profile, and discover accounts to follow.

## Features

- Sign up, sign in, sign out, and change password
- Create posts with text and images
- Like, comment on, reply to, share, edit, delete, and bookmark posts
- View profiles and posts from other users
- Follow and unfollow users
- Browse follow suggestions and the accounts you follow
- Search accounts and posts
- View notifications and mark them as read
- Responsive mobile navigation and profile views

## Tech Stack

- React 19 and TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS 4
- HeroUI
- React Icons

## Getting Started

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL printed by Vite in your browser.

Create an account or sign in through the app to use authenticated features.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check the app and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## API

The app uses the Route Posts API:

```text
https://route-posts.routemisr.com
```

Authentication and social actions are sent to this API. The app currently configures the API base URL in its request components and hooks.

## Project Structure

```text
src/
├── components/   Reusable UI, posts, comments, search, and follow components
├── context/      Authentication context
├── layout/       Navbar, sidebars, and page layout
├── pages/        Home, authentication, search, and profile pages
├── types/        TypeScript types
├── App.tsx       Application routes and providers
└── App.css       Global styles and theme tokens
```
