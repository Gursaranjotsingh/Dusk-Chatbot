# Dusk — Real-Time Chat Application

A full-stack, WhatsApp-style real-time chat app.

**Stack:** React + Vite · Node.js + Express · MongoDB · Socket.IO · JWT · bcrypt · Tailwind CSS

```
chat-app/
├── client/                  React frontend (Vite)
│   ├── src/
│   │   ├── components/      Reusable UI: Navbar, UserList, ChatWindow, MessageBubble, Avatar, Loader, TypingIndicator, ProtectedRoute
│   │   ├── pages/            Login, Register, Chat
│   │   ├── context/          AuthContext, SocketContext
│   │   ├── hooks/             useAuth, useSocket
│   │   ├── utils/             api.js (axios instance)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── server/                  Express backend
    ├── config/db.js          MongoDB connection
    ├── models/                User.js, Message.js
    ├── middleware/            auth.js (JWT), errorHandler.js
    ├── controllers/           authController.js, userController.js, messageController.js
    ├── routes/                 authRoutes.js, userRoutes.js, messageRoutes.js
    ├── socket/socket.js        Socket.IO real-time logic
    ├── server.js
    ├── package.json
    └── .env.example
```

---

## 1. Install Node.js

Download and install **Node.js 18 or later** from https://nodejs.org (LTS version recommended).

Verify the install:

```bash
node -v
npm -v
```

---

## 2. Install MongoDB (choose ONE option)

### Option A — MongoDB Community Server (local)

Download and install from https://www.mongodb.com/try/download/community, following the instructions for your OS. Once installed, start the service:

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows: MongoDB installs as a Windows Service and starts automatically.

# Linux (systemd)
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify it's running:

```bash
mongosh
```

If it connects, you're good — exit with `exit`.

### Option B — MongoDB Atlas (cloud, no local install)

1. Create a free account at https://www.mongodb.com/cloud/atlas/register
2. Create a free (M0) cluster.
3. Under **Database Access**, create a user with a username/password.
4. Under **Network Access**, add your current IP (or `0.0.0.0/0` for development).
5. Click **Connect → Drivers** and copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chat-app?retryWrites=true&w=majority
   ```
   You'll paste this into `MONGO_URI` below.

---

## 3. Create the database

No manual creation needed — MongoDB creates the `chat-app` database and its collections automatically the first time the app writes data (e.g. when you register the first user).

---

## 4. Create the `.env` files

### server/.env

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chat-app
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

- If using **Atlas**, replace `MONGO_URI` with your Atlas connection string.
- Generate a strong `JWT_SECRET`, e.g. run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### client/.env

```bash
cd ../client
cp .env.example .env
```

```
VITE_API_URL=http://localhost:5000
```

---

## 5. Install dependencies

```bash
# From the project root
cd server
npm install

cd ../client
npm install
```

---

## 6. Run the backend

```bash
cd server
npm run dev
```

You should see:

```
MongoDB connected: <host>
Server running on port 5000
```

---

## 7. Run the frontend

Open a **new terminal**:

```bash
cd client
npm run dev
```

You should see a Vite URL, typically:

```
Local:   http://localhost:5173/
```

---

## 8. Open the browser

Go to **http://localhost:5173**

---

## 9. Test sign up

1. Click **Sign up**.
2. Enter a username (3+ chars), email, and password (6+ chars).
3. Submit — you'll be logged in and redirected to the chat screen automatically.

## 10. Test login

1. Open a **second browser** (or an incognito window) to simulate a second user.
2. Register a second account there.
3. Log in with each account in its own window.

## 11. Test chatting

1. In one window, search for the other user's username in the sidebar and click their name.
2. Type a message and press **Enter** (or click send) — it should appear instantly in both windows.
3. Try the emoji picker, typing indicator (start typing and watch the other window), and dark mode toggle.

---

## Google Sign-In Setup

The app supports "Continue with Google" alongside normal username/password auth. To enable it:

### A. Create an OAuth Client ID (skip if you already have one)

1. Go to https://console.cloud.google.com/ and create/select a project.
2. Navigate to **APIs & Services → OAuth consent screen**. Choose **External**, fill in an app name and your email, and save (test mode is fine for local development).
3. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
4. Application type: **Web application**.
5. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   ```
6. Under **Authorized redirect URIs**, you can leave this blank (this flow uses Google Identity Services' one-tap/token flow, not a redirect).
7. Click **Create**. You'll get a **Client ID** (ends in `.apps.googleusercontent.com`) and a **Client Secret**.

> **Only the Client ID is needed by this app** — token verification on the backend uses `google-auth-library`'s `verifyIdToken`, which only requires the Client ID as the "audience." You do **not** need to put the Client Secret in either `.env` file. Keep the secret private and don't paste it into chats, code, or commits — if a secret is ever exposed, reset it immediately from the Credentials page.

### B. Add the Client ID to both `.env` files

**server/.env**
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**client/.env**
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

(Both `.env.example` files are pre-filled with the Client ID you provided during setup — replace it with your own if you rotate it.)

### C. Restart both servers

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

The "Continue with Google" button will appear on both the Login and Register pages. Signing in with Google:
- Creates a new account automatically the first time (username is derived from your Google name/email, made unique if taken), or
- Logs into an existing account if the email already matches one you registered with a password — the two get linked.

---

## Environment Variable Reference

### server/.env
```
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
```

### client/.env
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
```

---

## API Reference

| Method | Endpoint              | Auth | Description                          |
|--------|-----------------------|------|--------------------------------------|
| POST   | /api/auth/register    | No   | Create a new account                 |
| POST   | /api/auth/login       | No   | Log in, returns JWT + user           |
| POST   | /api/auth/google      | No   | Verify Google ID token, returns JWT + user |
| GET    | /api/auth/me          | Yes  | Get current logged-in user           |
| GET    | /api/users            | Yes  | List users (supports `?search=`)     |
| GET    | /api/messages/:id     | Yes  | Get conversation with user `:id`     |
| POST   | /api/messages         | Yes  | Send a message (REST fallback)       |

Real-time events are handled via Socket.IO (`send-message`, `receive-message`, `typing`, `stop-typing`, `mark-seen`, `messages-seen`, `online-users`).

---

## Features Included

- JWT authentication (register/login/logout), passwords hashed with bcrypt
- "Continue with Google" sign-in/sign-up (Google Identity Services + backend ID-token verification)
- Protected routes on the frontend
- Real-time messaging via Socket.IO (instant delivery, no refresh)
- Sent messages on the right, received on the left, with distinct bubble and text colors for each
- Read receipts: ticks turn from gray to blue the instant a message is seen
- Online/offline presence + last-seen timestamps
- Typing indicators
- User search
- Emoji picker
- Send on Enter (Shift+Enter for newline)
- Auto-scroll to newest message
- Dark mode with persisted preference
- Responsive, mobile-friendly layout
- Toast notifications for errors/success
- Centralized error handling & input validation on the backend
- Duplicate username/email prevention

---

## Troubleshooting

### MongoDB connection errors (`MongoServerError`, `ECONNREFUSED`, timeouts)
- Confirm MongoDB is actually running: `mongosh` should connect successfully.
- If using **Atlas**, double-check your IP is whitelisted under Network Access, and that the username/password in `MONGO_URI` are URL-encoded (e.g. `@` becomes `%40`).
- Make sure `MONGO_URI` in `server/.env` has no extra quotes or spaces.
- Restart the server after editing `.env` — Node only reads it on startup.

### JWT errors (`jwt malformed`, `invalid signature`, constant logouts)
- Make sure `JWT_SECRET` in `server/.env` is set and hasn't changed since your last login (changing it invalidates all existing tokens — log in again).
- Clear your browser's local storage (DevTools → Application → Local Storage) if tokens look stale after switching environments.
- Ensure the `Authorization: Bearer <token>` header is being sent — this is handled automatically by `client/src/utils/api.js`.

### CORS issues (`blocked by CORS policy`)
- `CLIENT_URL` in `server/.env` must exactly match the URL your frontend runs on (including port), e.g. `http://localhost:5173` — no trailing slash.
- Restart the backend after changing `CLIENT_URL`.

### Socket.IO connection problems (chat not updating live, `connect_error`)
- Confirm `VITE_API_URL` in `client/.env` points to the running backend (`http://localhost:5000`).
- Check the backend terminal for `Socket connected: <username>` logs when you load the chat page — if missing, the JWT sent by the socket client may be invalid or expired (log out and back in).
- Browser DevTools → Network → WS tab should show an active websocket connection; if it's stuck in "pending," a firewall or ad-blocker may be interfering.
- Restart both servers after changing any `.env` file.

### Port already in use
- Change `PORT` in `server/.env`, or stop whatever else is using port 5000/5173.

### "Username is already taken" on first run
- This means MongoDB already has data from a previous test. Either register with a different username, or drop the database: in `mongosh`, run `use chat-app` then `db.dropDatabase()`.

---

Enjoy chatting! 💬
