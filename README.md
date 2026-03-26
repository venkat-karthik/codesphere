<div align="center">

<img src="public/next.svg" alt="CodeSphere" width="60" />

# CodeSphere

**The coding ecosystem that changes lives.**

Learn with structured paths · Build with collaborative tools · Connect through vibrant communities · Discover global events

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://codesphere.vercel.app) · [Report Bug](https://github.com/venkat-karthik/codesphere/issues) · [Request Feature](https://github.com/venkat-karthik/codesphere/issues)

</div>

---

## What is CodeSphere?

CodeSphere is an all-in-one developer platform that brings together everything a programmer needs — from structured learning paths and live coding sessions to collaborative project workspaces and a global events map. Whether you're writing your first line of code or shipping production software, CodeSphere walks with you.

---

## Features

### 📚 Structured Learning
Curated roadmaps from beginner to expert. Notes, PDFs, videos, and hands-on tests — all in one place. Track your progress and follow guided paths at your own pace.

### 👥 Vibrant Communities
Join public or private communities. Share knowledge, get help, pin important discussions, and grow alongside thousands of developers worldwide.

### 🌍 Global Events
Discover tech conferences, hackathons, and meetups on an interactive 3D globe. Color-coded urgency markers and filters by topic, city, or date — never miss what matters.

### 🎥 Live Sessions
Create or join live coding sessions with Google Meet integration. Public or private, real-time collaboration made simple.

### 💻 Virtual Codex
Collaborative project workspaces with task tracking, discussions, file sharing, and milestone management for your team.

### 🧪 Sandbox Learning
Learn by building real projects with guided step-by-step sandboxes. From portfolios to REST APIs — hands-on from day one.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Radix UI, shadcn/ui |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Real-time | Socket.IO Client |
| Auth | JWT + OAuth (RBAC) |

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)

### Installation

```bash
# Clone the repo
git clone https://github.com/venkat-karthik/codesphere.git
cd codesphere

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin panel (users, roles, sessions, content)
│   ├── codex/            # Virtual Codex workspaces
│   ├── communities/      # Community pages
│   ├── dashboard/        # User dashboard & settings
│   ├── events/           # Global events map
│   ├── learning/         # Learning paths
│   ├── sandbox/          # Guided sandbox projects
│   ├── sessions/         # Live coding sessions
│   └── tests/            # Assessments
├── components/
│   ├── ui/               # shadcn/ui base components (53 components)
│   ├── layout/           # Navbar, Footer, shared layout
│   ├── chat/             # Community chat
│   └── ...               # Feature-specific components
├── lib/
│   ├── api.ts            # API utilities
│   └── utils.ts          # Shared helpers
└── middleware.ts          # Auth & route protection
```

---

## Pricing

| Plan | Price | Highlights |
|---|---|---|
| Free | ₹0 / forever | Basic learning paths, public communities, event browsing |
| Standard | ₹50 / month | Full paths, all resources, live sessions, Codex, analytics |
| Premium | ₹100 / month | Everything + AI roadmaps, private Codex, advanced sandboxes |

---

## Security

- JWT + OAuth authentication
- Role-Based Access Control (RBAC)
- End-to-end route protection via middleware
- Admin panel with session and lock management
- 99.9% uptime SLA

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "feat: your feature description"

# Push and open a PR
git push origin feature/your-feature
```

---

## License

MIT © [venkat-karthik](https://github.com/venkat-karthik)

---

<div align="center">
  <sub>Built with ❤️ for developers, by developers.</sub>
</div>
