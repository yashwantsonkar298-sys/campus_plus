# BlogVerse — Blog Management Platform 📝

A modern, fully-featured blog management platform built with **React.js**. Users can explore, read, create, edit, and delete blog posts with a beautiful, responsive UI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Features
- 📖 **Explore & View** blog posts with cover images, author info, tags, and reading time
- 📄 **Read Individual Posts** with full content rendering
- 🔍 **Search & Filter** — Search by title, tags, author; filter by category
- ✍️ **Create Blog Posts** — Rich form with cover image picker, categories, and tags
- ✏️ **Edit & Delete Posts** — Full CRUD operations
- ⚠️ **Empty States** — Graceful handling of no results, missing posts

### Bonus Features
- **Editorial Writing Studio** — live card preview, automatic reading-time calculation, quality checklist, and local draft recovery
- **Reader-focused Discovery** — sorting by newest, popularity, discussion, or quick reads alongside search and category filters
- **Long-form Reading Experience** — a generated table of contents, reading progress, safe lightweight markdown rendering, and resilient sharing
- **Accessibility Foundations** — visible keyboard focus, skip link, semantic labels, motion reduction support, and clearer feedback states
- 🌓 **Dark / Light Mode** — Toggle with smooth animations, persisted in localStorage
- ❤️ **Likes** — Like/unlike posts with animated interactions
- 🔖 **Bookmarks** — Save posts and view them on a dedicated Bookmarks page
- 💬 **Comments** — Add and delete comments on each post
- 🎨 **Animations** — Smooth page transitions, hover effects, and micro-interactions (Framer Motion)
- 📱 **Fully Responsive** — Works perfectly on desktop, tablet, and mobile
- 💾 **Persistent Data** — All data saved in localStorage (no backend needed)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or above)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/blog-platform.git

# Navigate to the project
cd blog-platform

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js 19 | UI Library |
| React Router v7 | Client-side Routing |
| Framer Motion | Animations & Transitions |
| React Icons | Icon Library |
| Context API | State Management |
| localStorage | Data Persistence |
| CSS3 Variables | Theming (Dark/Light) |

## 📁 Project Structure

```
blog-platform/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BlogCard.js / .css
│   │   ├── CommentSection.js / .css
│   │   ├── EmptyState.js / .css
│   │   ├── Navbar.js / .css
│   │   ├── Notification.js / .css
│   │   └── SearchBar.js / .css
│   ├── context/
│   │   ├── BlogContext.js
│   │   └── ThemeContext.js
│   ├── data/
│   │   └── blogData.js
│   ├── pages/
│   │   ├── Home.js / .css
│   │   ├── PostDetail.js / .css
│   │   ├── CreatePost.js / .css
│   │   ├── EditPost.js
│   │   └── Bookmarks.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

## 📸 Screenshots

### Home Page (Light Mode)
Explore all blog posts with search, filter, and category navigation.

### Blog Post Detail
Read full articles with likes, bookmarks, and comments.

### Create Post
Rich form with cover image selection and category/tag management.

### Dark Mode
Beautiful dark theme with smooth toggle animation.

## 📋 Evaluation Criteria Met

| Criteria | Implementation |
|---|---|
| **UI & Responsiveness** | Clean design with CSS Grid, Flexbox, and media queries for all screen sizes |
| **Functionality** | Full CRUD, search, filter, likes, bookmarks, comments — all working |
| **Code Quality** | Component-based architecture, Context API, clean separation of concerns |
| **Problem-Solving** | localStorage persistence, empty states, form validation, optimistic updates |
| **Creativity** | Dark/light mode, animations, notification system, responsive design |

## 📄 License

MIT License — feel free to use this project for learning and development.

---

**Built with ❤️ by Yash Wankhede**
