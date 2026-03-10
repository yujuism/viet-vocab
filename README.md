# 🇻🇳 Viet Vocab

A Vietnamese vocabulary learning app built with **SvelteKit** and **Firebase Realtime Database**. Features full CRUD management and an interactive flashcard game.

🌐 **Live:** https://cloudcomputing-72286.web.app

---

## Features

- **CRUD** — Create, Read, Update, Delete Vietnamese vocabulary
- **Flashcard Game** — Flip card game to practice memorization
- **Pagination** — 8 words per page with smart ellipsis navigation
- **Search & Filter** — Search by word/meaning, filter by category
- **Real-time** — Firebase Realtime Database syncs instantly
- **Responsive** — Works on mobile and desktop

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Svelte 5, SvelteKit |
| Database | Firebase Realtime Database |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Package Manager | pnpm |

## Data Structure

Each vocabulary entry stores 5 fields:

```json
{
  "kata": "xin chào",
  "arti": "halo",
  "pelafalan": "sin ciao",
  "contoh": "Xin chào, tôi là Nam.",
  "kategori": "Salam"
}
```

**Categories:** Salam · Angka · Warna · Makanan · Tempat · Umum

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Firebase project with Realtime Database enabled

### Installation

```bash
# Clone the repo
git clone git@github.com:yujuism/viet-vocab.git
cd viet-vocab

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config in .env
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Get these values from **Firebase Console → Project Settings → Your apps**.

### Development

```bash
pnpm dev
```

App runs at `http://localhost:5173`

### Build

```bash
pnpm build
```

## Deployment

This project uses **GitHub Actions** to auto-deploy to Firebase Hosting on every push to `main`.

### Setup

1. Enable **Firebase Hosting** in Firebase Console
2. Generate a service account key: **Firebase Console → Project Settings → Service accounts → Generate new private key**
3. Add the following secrets to your GitHub repository (**Settings → Secrets → Actions**):

| Secret | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Contents of the service account JSON file |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

Once configured, every push to `main` will automatically build and deploy.

## Project Structure

```
src/
├── app.css                  # Global styles
├── lib/
│   ├── firebase.js          # Firebase initialization
│   └── vocab.js             # CRUD functions
└── routes/
    ├── +layout.svelte       # Root layout
    ├── +page.js             # Disable SSR
    ├── +page.svelte         # Main CRUD page
    └── game/
        ├── +page.js         # Disable SSR
        └── +page.svelte     # Flashcard game
```

## Firebase Database Rules

For development, set your Realtime Database rules to:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ For production, restrict rules to authenticated users only.
