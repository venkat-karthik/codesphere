# CodeSphere — Complete Project Documentation

> Last updated: April 2026 | Status: Development / Pre-Production

---

## 1. Project Overview

CodeSphere is a full-stack student learning platform — a gamified educational ecosystem for coding education. It combines structured learning paths, live classes, AI mentoring, a code sandbox, community channels, and a reward economy (CodeCoins) into one platform.

**Target users:** Students learning to code, instructors/admins managing content.

**Roles:**
- `student` — default role, access to all learning features
- `sub_admin` — can create problems, roadmaps, manage content
- `admin` — full access including user management and analytics

---

## 2. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18.3 + TypeScript 5.6 | UI framework |
| Vite 5.4 | Build tool / dev server |
| TailwindCSS 3.4 | Styling |
| Radix UI (full suite) | Accessible component primitives |
| TanStack React Query v5 | Server state / data fetching |
| Wouter 3.3 | Client-side routing |
| Framer Motion 11 | Page transitions and animations |
| Monaco Editor | In-browser code editor |
| Recharts 2.15 | Analytics charts |
| Socket.io-client 4.8 | Real-time WebSocket communication |
| react-globe.gl | 3D globe visualization (SphereMap) |
| simple-peer | WebRTC peer connections (video calls) |
| xterm.js | Terminal emulator in browser |
| Stripe + Razorpay (client SDKs) | Payment UI |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 4.21 | REST API server |
| TypeScript 5.6 | Type safety |
| Drizzle ORM 0.39 | Database ORM |
| PostgreSQL via Neon (serverless) | Primary database |
| express-session + connect-pg-simple | Session management (PostgreSQL-backed in prod) |
| bcryptjs | Password hashing |
| Passport.js (local strategy) | Authentication middleware |
| OpenAI SDK (xAI Grok) | AI Mentor backend |
| Razorpay SDK | Payment processing |
| Resend | Transactional email |
| AWS S3 / Cloudflare R2 | File storage (PDFs, avatars) |
| Socket.io 4.8 | WebSocket server |
| Helmet | HTTP security headers |
| express-rate-limit | Rate limiting |
| Sentry | Error monitoring / APM |
| multer | File upload handling |
| Vitest | Unit testing |

---

## 3. Repository Structure

```
codesphere/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── App.tsx            # Root router + auth guard
│   │   ├── main.tsx           # React entry point
│   │   ├── index.css          # Global styles + theme variables
│   │   ├── pages/             # 36 page components
│   │   ├── components/        # Shared + feature components
│   │   │   └── ui/            # 50+ Radix UI wrappers (shadcn/ui)
│   │   ├── contexts/          # React contexts (Theme, UserRole, Notifications, Assignments)
│   │   ├── hooks/             # Custom hooks (useAuth, useStudyTimer, useLocalStorage)
│   │   ├── lib/               # Utilities (queryClient, auth, storage, utils)
│   │   └── data/              # Static mock data + tutorial content
│   ├── index.html
│   └── package.json
├── server/                    # Express backend
│   ├── index.ts               # App bootstrap, middleware, session, Sentry
│   ├── routes.ts              # Router registry (mounts all sub-routers)
│   ├── storage.ts             # Storage interface (abstract)
│   ├── dbStorage.ts           # Drizzle ORM implementation
│   ├── db.ts                  # Neon DB connection
│   ├── middleware.ts          # requireAuth, requireAdmin, requireSubAdmin, sanitizeBody
│   ├── email.ts               # Resend email templates
│   ├── videoServer.ts         # Socket.io WebRTC signaling server
│   ├── seed.ts                # Database seeder
│   ├── report.ts              # Analytics report generation
│   ├── routes/                # Feature-specific route handlers
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── admin.ts
│   │   ├── roadmaps.ts
│   │   ├── content.ts
│   │   ├── community.ts
│   │   ├── payments.ts
│   │   ├── execute.ts
│   │   ├── store.ts
│   │   ├── mentor.ts
│   │   ├── liveClasses.ts
│   │   ├── analytics.ts
│   │   └── pdfResources.ts
│   ├── lib/                   # Server utilities
│   ├── types/                 # TypeScript type declarations
│   └── tests/                 # Vitest test files
├── shared/
│   └── schema.ts              # Drizzle schema + Zod validators (shared by client + server)
├── package.json               # Root (server deps + scripts)
├── Dockerfile                 # Container build
├── .env.example               # Required environment variables
└── drizzle.config.ts          # Drizzle migration config
```

**Total files (approx):** ~120+ source files
- Pages: 36
- Components: 30+ (+ 50+ UI primitives)
- Server routes: 13 route files
- Contexts/Hooks: 9
- DB schema tables: 13+

---

## 4. Database Schema (PostgreSQL via Neon)

```
users
  id, firstName, lastName, email, password (hashed), role
  level, xp, streak, codeCoins, totalStudyTime
  subscriptionType (free/premium/pro), subscriptionExpiry
  theme, profileImage, bio, preferences (json)
  emailVerified, emailVerifyToken, otp, otpExpiry
  passwordResetToken, passwordResetExpiry, joinDate, studyPattern (json)

problems
  id, title, description, difficulty (Easy/Medium/Hard)
  category, tags (json), xpReward, hints (json), solution, isDaily

user_solutions
  id, userId → users, problemId → problems
  solution, isCorrect, xpEarned, submittedAt

roadmaps
  id, title, description, category, difficulty
  modules (json), estimatedTime

user_progress
  id, userId → users, roadmapId → roadmaps
  completedModules (json), currentModule
  progressPercentage, lastAccessed

resources
  id, title, description, category, type (pdf/video/article)
  url, difficulty, tags (json), downloadCount, fileSize
  pageCount, createdAt

live_classes
  id, title, description, instructorId → users
  startTime, endTime, status (scheduled/live/ended)
  maxParticipants, currentParticipants, roomId, tags (json)

community_posts
  id, userId → users, title, content, category
  likes, replies (json), isResolved, createdAt

community_channels
  id, name, type (text/voice), creatorId → users
  isPrivate, memberCount, description

channel_messages
  id, channelId → community_channels, userId → users
  content, attachments (json), createdAt

payments
  id, userId → users, amount, subscriptionType
  status (pending/success/failed), orderId, transactionId
  createdAt

projects
  id, userId → users, name, language, framework
  sourceCode, isPublic, createdAt

student_analytics
  id, studentId → users, date
  studyTimeMinutes, problemsAttempted, problemsSolved, xpEarned
```

---

## 5. All Pages

### Student Pages
| Page | Route | Description |
|---|---|---|
| Landing | `/` (unauthenticated) | Marketing landing page |
| Welcome | `/welcome` | Post-registration onboarding |
| Dashboard | `/dashboard` | Bento grid: progress, daily challenge, leaderboard, notifications |
| Roadmaps | `/learning/roadmaps` | Browse + track learning paths |
| Resources | `/learning/resources` | PDF resources library |
| Videos | `/learning/videos` | Video tutorials |
| TextTutorials | `/learning/tutorials` | Text-based tutorials (Python, Java, C) |
| Live Classes | `/learning/live-classes` | Join scheduled live sessions |
| Problems | `/practice/problems` | Coding challenges with daily challenge |
| Community | `/community` | Text/voice channels + forum |
| Studio | `/studio` | Code sandbox (Monaco + execution) |
| Mentor | `/mentor` | AI chatbot (xAI Grok) |
| EnhancedProfile | `/profile` | Stats, achievements, badges |
| EnhancedSettings | `/settings` | Theme, preferences, account |
| CodeCoinStore | `/store` | Spend CodeCoins on cosmetics/features |
| VideoCall | `/video-call` | WebRTC video conferencing |
| SphereMap | `/sphere-map` | 3D globe learning path visualization |
| ResetPassword | `/reset-password` | Password reset via token |
| VerifyEmail | `/verify-email` | Email verification |
| OtpVerification | `/verify-otp` | OTP entry screen |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |

### Admin Pages
| Page | Route | Status |
|---|---|---|
| PlatformAnalytics | `/admin/analytics` | ✅ Fully interactive |
| AdminLiveClasses | `/admin/live-classes` | ✅ Fully interactive |
| AdminPDFResources | `/admin/resources` | ✅ Fully interactive |
| AdminVideoResources | `/admin/videos` | ✅ Fully interactive |
| AdminSphereMap | `/admin/sphere-map` | ⚠️ Local state only (no API persistence) |

---

## 6. Admin Pages — Detailed Interactivity Audit

### PlatformAnalytics (`/admin/analytics`) ✅
- Fetches real user list from `GET /api/admin/users`
- Search/filter users by name or email
- Delete users via `DELETE /api/admin/users/:id`
- Create coding problems via `POST /api/admin/problems` (title, description, difficulty, category, XP reward, hints, solution)
- Create roadmaps via `POST /api/admin/roadmaps`
- Revenue charts (Recharts LineChart) — currently uses hardcoded mock KPI data (MRR, churn, ARPU, LTV, CAC)
- Subscription charts — also mock data
- **Gap:** Revenue/subscription charts need to be wired to real payment data from `/api/analytics`

### AdminLiveClasses (`/admin/live-classes`) ✅
- Full CRUD: create, edit, delete live classes
- Status transitions: scheduled → live → ended via PATCH
- All operations hit real API endpoints
- Instructor name auto-populated from logged-in user

### AdminPDFResources (`/admin/resources`) ✅
- Upload PDFs via multipart form to `POST /api/pdfs`
- Edit metadata (title, description, category, difficulty) via `PUT /api/pdfs/:id`
- Delete via `DELETE /api/pdfs/:id`
- View/download links open in new tab
- Download count tracked

### AdminVideoResources (`/admin/videos`) ✅
- Add/edit video resources (YouTube or direct URL)
- Metadata: title, description, category, difficulty, duration
- Hits `POST /api/resources` and `PATCH /api/resources/:id`
- **Gap:** No delete button implemented in this page

### AdminSphereMap (`/admin/sphere-map`) ⚠️
- UI is fully interactive (add/edit/delete events with lat/lng/date)
- **Critical gap:** Uses local React state only — no API calls, data is lost on page refresh
- Needs a backend endpoint and DB table for sphere map events

---

## 7. API Endpoints

### Auth — `/api/auth`
```
POST   /register              Register new user (sends OTP email)
POST   /login                 Login (sets session, awards streak coins)
POST   /logout                Destroy session
GET    /me                    Get current session user
POST   /change-password       Change password (requires auth)
POST   /forgot-password       Send password reset email
POST   /reset-password        Reset password via token
POST   /send-verification     Resend OTP verification email
POST   /verify-otp            Verify OTP code
GET    /verify-email          Legacy token-based email verification
```

### Users — `/api/users`
```
GET    /:id                   Get user profile
PATCH  /:id                   Update profile (name, bio, theme, etc.)
POST   /:id/study-time        Log study session minutes
POST   /:id/avatar            Upload profile picture (multipart)
GET    /:userId/solutions     Get user's problem submissions
POST   /:userId/solutions     Submit problem solution
```

### Admin — `/api/admin`
```
GET    /users                 List all users (admin only)
DELETE /users/:id             Delete user (admin only)
POST   /problems              Create coding problem (sub_admin+)
POST   /roadmaps              Create roadmap (sub_admin+)
```

### Roadmaps — `/api/roadmaps`
```
GET    /                      List all roadmaps
GET    /:id                   Get roadmap detail
GET    /:id/progress/:userId  Get user progress on roadmap
POST   /:id/progress          Update progress
```

### Content — `/api/content` + `/api/resources` + `/api/videos` + `/api/pdfs`
```
GET    /api/resources         List resources (filter by type/category)
POST   /api/resources         Create resource (admin)
PATCH  /api/resources/:id     Update resource
GET    /api/videos            List video resources
GET    /api/pdfs              List PDF resources
POST   /api/pdfs              Upload PDF (multipart, admin)
PUT    /api/pdfs/:id          Update PDF metadata
DELETE /api/pdfs/:id          Delete PDF
GET    /api/problems          List problems (filter by difficulty/category)
GET    /api/problems/daily    Get today's daily challenge
GET    /api/problems/:id      Get problem detail
```

### Community — `/api/community`
```
GET    /posts                 List community posts
POST   /posts                 Create post
GET    /channels              List channels
POST   /channels              Create channel
GET    /channels/:id/messages Get channel messages
POST   /channels/:id/messages Send message
```

### Payments — `/api/payments`
```
POST   /create-order          Create Razorpay order
POST   /verify                Verify payment signature
GET    /history               User payment history
```

### AI Mentor — `/api/mentor`
```
POST   /chat                  Send message to AI (rate-limited: 20/hr free, 100/hr premium)
```

### Live Classes — `/api/live-classes`
```
GET    /                      List all live classes
POST   /                      Create live class (admin)
PATCH  /:id                   Update / change status
DELETE /:id                   Delete live class
POST   /:id/join              Join a class (increment participants)
```

### Store — `/api/store`
```
GET    /items                 List store items
POST   /purchase              Purchase item with CodeCoins
GET    /inventory/:userId     User's purchased items
```

### Analytics — `/api/analytics`
```
GET    /user/:id              User engagement metrics
GET    /platform              Platform-wide stats (admin)
```

### Execute — `/api/execute`
```
POST   /                      Execute code (Judge0 via RapidAPI)
```

---

## 8. Features Implemented

### Authentication & User Management
- Email + password registration with bcrypt hashing
- OTP-based email verification (10-min expiry, sent via Resend)
- Session-based auth (PostgreSQL-backed sessions in production)
- Password reset via email token (1-hour expiry)
- Role-based access control (student / sub_admin / admin)
- Demo accounts (userId ≤ 0) with restricted operations
- Profile picture upload (multipart → S3/R2)
- 12 theme options: dark, light, star-trek, cyberpunk, matrix, ocean, forest, sunset, neon, minimal, retro, aurora

### Gamification System
- XP system: earn XP by solving problems, completing modules, daily challenges
- Level progression: 1000 XP = 1 level, with named badges (Junior Suite Developer, etc.)
- Daily streak: consecutive login bonus (+5 CodeCoins/day)
- CodeCoins: in-game currency earned through activity
- Leaderboard: top 20 users by XP
- Achievements/badges displayed on profile
- Daily challenge: special problem with +50 XP bonus

### Learning
- Structured roadmaps with JSON-defined modules and progress tracking
- PDF resources library with download tracking
- Video tutorials (YouTube embeds or direct URLs)
- Text-based tutorials for Python, Java, C (static data)
- Live classes with scheduling, status management, participant tracking

### Practice
- Coding problems categorized by difficulty (Easy/Medium/Hard) and topic
- Problem hints and reference solutions
- Submission tracking with correctness checking
- XP rewards on correct solutions
- Daily challenge rotation

### AI Mentor
- Powered by xAI Grok (OpenAI-compatible API)
- Rate limiting: 20 messages/hour (free), 100/hour (premium)
- Message history context passed per session
- Fallback local responses for common coding questions when API unavailable

### Code Studio
- Monaco Editor (same as VS Code) in-browser
- Multi-language support
- Code execution via Judge0 API (RapidAPI)
- xterm.js terminal output display
- Project save/load (stored in DB)

### Community
- Text channels with real-time messaging (Socket.io)
- Voice channels (WebRTC via simple-peer)
- Discussion forum (posts, replies, likes, resolved status)
- Channel creation (public/private)

### Payments
- Razorpay integration (INR pricing)
- Plans: Free, Pro (₹1999/mo or ₹19999/yr), Enterprise (₹4999/mo or ₹49999/yr)
- Payment verification with signature check
- Payment history stored in DB
- Subscription type stored on user record

### Real-time Features
- Socket.io WebSocket server for live class signaling
- WebRTC peer connections for video calls (VideoServer.ts)
- Real-time participant count updates
- Live chat in community channels

### Study Tracking
- Auto-flush study timer (every 60 seconds, runs in background via useStudyTimer hook)
- Daily study time logged to student_analytics table
- Total study time accumulated on user record
- Study pattern JSON stored per user

### Admin Dashboard
- User list with search, stats, delete
- Create/manage coding problems
- Create/manage roadmaps
- Schedule/manage live classes
- Upload/manage PDF resources
- Add/manage video resources
- Revenue KPI cards (MRR, ARPU, churn, LTV, CAC)
- Charts for revenue and subscription trends

---

## 9. How Files Interact (Data Flow)

### Frontend Request Flow
```
User Action
  → React Component (page/component)
  → TanStack React Query (useQuery / useMutation)
  → apiRequest() in lib/queryClient.ts
  → fetch() to /api/... endpoint
  → Express route handler
  → middleware (requireAuth / requireAdmin)
  → storage.ts method (Drizzle ORM)
  → Neon PostgreSQL
  → Response JSON
  → React Query cache update
  → Component re-render
```

### Authentication Flow
```
Register:
  AuthModals.tsx → POST /api/auth/register
  → bcrypt.hash(password) → storage.createUser()
  → session.userId = user.id
  → sendEmail(OTP) via Resend (non-blocking)
  → redirect to /verify-otp

Login:
  AuthModals.tsx → POST /api/auth/login
  → storage.getUserByEmail() → bcrypt.compare()
  → session.userId = user.id
  → streak bonus: +5 codeCoins if consecutive day
  → useAuth hook fetches /api/auth/me → UserRoleContext updated
  → App.tsx redirects admin → /admin/analytics, student → /dashboard
```

### Role-Based Routing
```
App.tsx
  → useAuth() → isAuthenticated, user
  → useUserRole() → isAdmin, isSubAdmin
  → Admin routes: render admin page if isAdmin || isSubAdmin, else redirect to Dashboard
  → Layout.tsx → Sidebar.tsx shows different nav items based on role
```

### Study Timer
```
useStudyTimer hook (runs in AppContent)
  → setInterval every 60s
  → POST /api/users/:id/study-time { minutes: 1 }
  → storage.updateStudyTime() → increments totalStudyTime + logs to student_analytics
```

### Real-time (Socket.io)
```
VideoServer.ts (server)
  → listens on same HTTP server as Express
  → handles: join-room, offer, answer, ice-candidate, leave-room
  → broadcasts to room participants

VideoCall.tsx / LiveClasses.tsx (client)
  → socket.io-client connects to same origin
  → simple-peer for WebRTC negotiation
  → getUserMedia() for camera/mic
```

### Context Hierarchy
```
App.tsx
  └── QueryClientProvider (React Query)
      └── AuthProvider (useAuth hook)
          └── ThemeProvider (ThemeContext)
              └── UserRoleProvider (UserRoleContext)
                  └── NotificationsProvider
                      └── AssignmentProvider
                          └── Layout
                              └── Pages
```

---

## 10. Integrations

| Integration | Purpose | Config Key |
|---|---|---|
| Neon PostgreSQL | Primary database | `DATABASE_URL` |
| xAI Grok (OpenAI-compatible) | AI Mentor chat | `OPENAI_API_KEY`, `XAI_BASE_URL` |
| Razorpay | Payment processing (INR) | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Resend | Transactional email (OTP, welcome, reset) | `RESEND_API_KEY`, `EMAIL_FROM` |
| Cloudflare R2 / AWS S3 | File storage (PDFs, avatars) | `R2_*` or AWS credentials |
| Judge0 (RapidAPI) | Code execution engine | `JUDGE0_API_KEY`, `JUDGE0_URL` |
| Sentry | Error monitoring + performance APM | `SENTRY_DSN` |
| Google Drive (optional) | Alternative file storage | `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY` |
| Stripe (partial) | Alternative payment gateway | Stripe SDK present, not fully wired |
| Socket.io | Real-time WebSocket (live classes, chat) | Built-in |
| WebRTC (simple-peer) | Peer-to-peer video calls | Built-in |

---

## 11. Flowchart — System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Student  │  │  Admin   │  │  Auth    │  │  Public Pages  │  │
│  │  Pages   │  │  Pages   │  │  Pages   │  │ (Privacy/Terms)│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────────────┘  │
│       │              │              │                             │
│  ┌────▼──────────────▼──────────────▼──────────────────────┐    │
│  │              React Query + apiRequest()                   │    │
│  └────────────────────────┬──────────────────────────────────┘   │
│                            │ HTTP / WebSocket                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                     SERVER (Express + Node.js)                    │
│                                                                   │
│  Helmet  │  Rate Limiter  │  Session  │  Sentry                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    Route Handlers                         │    │
│  │  /api/auth  /api/users  /api/admin  /api/roadmaps        │    │
│  │  /api/content  /api/community  /api/payments             │    │
│  │  /api/mentor  /api/live-classes  /api/execute            │    │
│  │  /api/store  /api/analytics  /api/pdfs                   │    │
│  └──────────────────────┬───────────────────────────────────┘    │
│                          │                                        │
│  ┌───────────────────────▼───────────────────────────────────┐   │
│  │              storage.ts (Drizzle ORM)                      │   │
│  └───────────────────────┬───────────────────────────────────┘   │
│                           │                                       │
│  ┌────────────────────────▼──────────────────────────────────┐   │
│  │  VideoServer (Socket.io + WebRTC signaling)                │   │
│  └───────────────────────────────────────────────────────────┘   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────────┐
        │                   │                        │
┌───────▼──────┐  ┌─────────▼──────┐  ┌────────────▼──────────┐
│  Neon        │  │  Cloudflare R2 │  │  External APIs        │
│  PostgreSQL  │  │  (File Storage)│  │  xAI / Razorpay       │
│  (13 tables) │  │                │  │  Resend / Judge0      │
└──────────────┘  └────────────────┘  └───────────────────────┘
```

---

## 12. Feature Interaction Map

```
Registration/Login
  ├── sends OTP email (Resend)
  ├── creates session (PostgreSQL)
  ├── awards streak coins (CodeCoins)
  └── triggers study timer (useStudyTimer)

Dashboard
  ├── reads user XP/level/streak (users table)
  ├── shows daily challenge (problems table, isDaily=true)
  ├── shows leaderboard (users table, sorted by XP)
  └── shows notifications (NotificationsContext)

Problems Page
  ├── lists problems (problems table)
  ├── submit solution → user_solutions table
  ├── correct solution → XP added to users table
  ├── XP threshold → level up
  └── daily challenge → +50 XP bonus

Roadmaps Page
  ├── lists roadmaps (roadmaps table)
  ├── track progress → user_progress table
  └── complete module → XP reward

Studio (Code Sandbox)
  ├── Monaco Editor (client-side)
  ├── execute code → POST /api/execute → Judge0 API
  ├── save project → projects table
  └── output shown in xterm.js terminal

AI Mentor
  ├── POST /api/mentor/chat → xAI Grok API
  ├── rate limit check (free: 20/hr, premium: 100/hr)
  └── message history maintained per session

Live Classes
  ├── student: lists classes, joins → POST /api/live-classes/:id/join
  ├── admin: creates/edits/deletes → CRUD on live_classes table
  ├── "Start" → status: live → Socket.io room created
  └── WebRTC video via VideoServer.ts + simple-peer

Community
  ├── channels list (community_channels table)
  ├── messages (channel_messages table, real-time via Socket.io)
  └── forum posts (community_posts table)

Payments
  ├── select plan → POST /api/payments/create-order → Razorpay order
  ├── Razorpay checkout UI (client SDK)
  ├── verify → POST /api/payments/verify → signature check
  └── success → update users.subscriptionType + payments table

CodeCoin Store
  ├── lists items (store items)
  ├── purchase → deduct codeCoins from users table
  └── add to user inventory

Profile
  ├── reads user stats (XP, level, streak, study time)
  ├── shows achievements (computed from user data)
  └── upload avatar → POST /api/users/:id/avatar → R2/S3

Settings
  ├── theme change → users.theme updated + ThemeContext
  └── account settings → PATCH /api/users/:id
```

---

## 13. Known Gaps & Issues

### Admin Pages
| Issue | Page | Severity |
|---|---|---|
| AdminSphereMap uses local state only — data lost on refresh | AdminSphereMap | High |
| AdminVideoResources has no delete button | AdminVideoResources | Medium |
| Revenue/subscription charts use hardcoded mock data | PlatformAnalytics | Medium |
| No sub_admin creation UI (must be done via DB directly) | PlatformAnalytics | Medium |

### Features Partially Implemented
| Feature | Status | Notes |
|---|---|---|
| Stripe payments | Partial | SDK installed, not fully wired to backend |
| Google Drive storage | Partial | Config keys present, implementation unclear |
| Redis caching | Config only | `REDIS_URL` in .env.example, not used in code |
| Mongoose / MongoDB | Dependency present | `mongoose` in package.json but Drizzle/Neon is primary DB |
| AssistantManagement page | Exists in pages/ | Not in App.tsx routes — unreachable |
| ContentManagement page | Exists in pages/ | Not in App.tsx routes — unreachable |
| PaymentIntegration page | Exists in pages/ | Not in App.tsx routes — unreachable |
| AdvancedSandbox page | Exists in pages/ | Not in App.tsx routes — unreachable |
| Community.tsx | Exists alongside CommunityChannels.tsx | Duplicate, unclear which is canonical |
| Profile.tsx | Exists alongside EnhancedProfile.tsx | Old version, EnhancedProfile is used |
| Sandbox.tsx | Exists alongside Studio.tsx | Old version |
| Settings.tsx | Exists alongside EnhancedSettings.tsx | Old version |
| SphereMap.tsx (page) | Exists | Not in App.tsx routes |

### Security / Production Readiness
| Issue | Severity |
|---|---|
| SESSION_SECRET must be set to strong random value | Critical |
| Email verification not enforced (users can use platform without verifying) | Medium |
| No CSRF protection beyond sameSite cookie | Medium |
| File upload size limit (10MB) may need tuning for large PDFs | Low |

---

## 14. What Needs to Be Done for Production Deployment

### Step 1 — Infrastructure Setup

1. **Database**: Provision a Neon PostgreSQL database
   - Run `npm run db:push` to create all tables
   - Run `npm run db:seed` to seed initial data (problems, roadmaps)
   - Create the `session` table (auto-created by connect-pg-simple if `createTableIfMissing: true`)

2. **File Storage**: Set up Cloudflare R2 (recommended) or AWS S3
   - Create a bucket, generate access keys
   - Set `R2_*` environment variables

3. **Email**: Create a Resend account
   - Verify your sending domain
   - Set `RESEND_API_KEY` and `EMAIL_FROM`

4. **AI Mentor**: Get xAI API key from https://x.ai
   - Set `OPENAI_API_KEY` (xAI uses OpenAI-compatible format)
   - Set `XAI_BASE_URL=https://api.x.ai/v1`

5. **Payments**: Create Razorpay account (for Indian market)
   - Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

6. **Code Execution**: Subscribe to Judge0 on RapidAPI
   - Set `JUDGE0_API_KEY` and `JUDGE0_URL`

7. **Error Monitoring**: Create Sentry project
   - Set `SENTRY_DSN` and `VITE_SENTRY_DSN`

### Step 2 — Environment Variables

Create `.env` with all values from `.env.example`:
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=<64-char random string>
NODE_ENV=production
PORT=5000
APP_URL=https://your-domain.com
OPENAI_API_KEY=gsk_...
XAI_BASE_URL=https://api.x.ai/v1
JUDGE0_API_KEY=...
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=https://...
SENTRY_DSN=https://...
VITE_SENTRY_DSN=https://...
```

### Step 3 — Build & Deploy

**Option A: Railway / Render (recommended)**
```bash
# Build
npm run build

# Start
npm run start
```
- Set all env vars in the platform dashboard
- Railway/Render auto-detects the Dockerfile or uses `npm run start`
- WebSocket support is built-in on both platforms

**Option B: Docker**
```bash
docker build -t codesphere .
docker run -p 5000:5000 --env-file .env codesphere
```

**Option C: Vercel (frontend only)**
- Not recommended — the app is a monorepo with WebSocket server
- Would require splitting frontend/backend and hosting backend separately

### Step 4 — Post-Deploy Checklist
- [ ] Run `npm run db:push` against production DB
- [ ] Run `npm run db:seed` to populate initial content
- [ ] Create first admin user (set `role = 'admin'` directly in DB or via seed)
- [ ] Verify email sending works (test registration flow)
- [ ] Verify Razorpay webhook/callback URL is set to `https://your-domain.com/api/payments/verify`
- [ ] Test AI Mentor with a real message
- [ ] Test code execution in Studio
- [ ] Test live class creation and joining
- [ ] Set up custom domain + SSL (handled by Railway/Render automatically)
- [ ] Configure Sentry alerts

### Step 5 — Fixes Needed Before Multi-User Production Use
1. **AdminSphereMap**: Wire to a real API endpoint (create `/api/sphere-events` route + DB table)
2. **AdminVideoResources**: Add delete button/mutation
3. **PlatformAnalytics revenue charts**: Wire to real data from `/api/analytics/platform`
4. **Unreachable pages**: Add routes for AssistantManagement, ContentManagement, PaymentIntegration, AdvancedSandbox or remove them
5. **Duplicate pages**: Remove old Profile.tsx, Settings.tsx, Sandbox.tsx, Community.tsx
6. **Email verification enforcement**: Optionally gate platform access behind verified email
7. **Admin creation flow**: Add UI to promote users to sub_admin/admin role

---

## 15. File Count Summary

| Category | Count |
|---|---|
| Client pages | 36 |
| Client components (feature) | 30 |
| Client UI primitives (shadcn/ui) | 50+ |
| Client contexts | 4 |
| Client hooks | 5 |
| Client lib/utils | 5 |
| Client data files | 4 |
| Server route files | 13 |
| Server core files | 8 |
| Shared schema | 1 |
| Config files | ~10 |
| **Total source files** | **~170+** |

---

*Document generated from full codebase analysis. All API endpoints, components, and interactions verified against source code.*
