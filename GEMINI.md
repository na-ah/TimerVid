# TimerVid Project Context

## Project Overview
TimerVid is a productivity web application that combines a Pomodoro timer with YouTube video playback. Users can set different playlists for "Work" and "Break" sessions, allowing for a seamless workflow with background music or visual ambience.

**Key Features:**
- **Pomodoro Timer:** Customizable work/break cycles.
- **YouTube Integration:** Background video playback with playlist management.
- **Dual Playlists:** Separate playlists for focus (work) and relaxation (break).
- **Responsive Layout:** Tablet/Desktop optimized with a "Cinema Mode" for immersive viewing.
- **Audio Feedback:** Sound effects for timer events.

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (v14, Pages Router)
- **Language:** JavaScript (ES6+) / React (v18)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Mantine UI](https://mantine.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Jotai](https://jotai.org/) (Global Atoms), React Context API (Feature-scoped)
- **Video:** `react-youtube` wrapper for YouTube IFrame API.
- **Icons:** `react-icons` (FontAwesome 6, etc.)

## Directory Structure
The project follows a hybrid structure combining Next.js conventions with Atomic Design.

```
src/
├── assets/          # Static assets (mp3, etc.)
├── atoms/           # Jotai global state definitions (atoms.ts)
├── components/      # Atomic Design UI Components
│   ├── Atoms/       # Basic building blocks (buttons, raw inputs)
│   ├── Molecules/   # Compound components (Player, PlaylistTabs)
│   ├── Organisms/   # Complex sections (Header, PlaylistContainer, PlayerContainer)
│   ├── Templates/   # Page layouts (TimerVid.jsx)
│   └── ui/          # Reusable UI components (shadcn/ui based)
├── context/         # React Context Providers (TimerProvider, PlaylistProvider)
├── hooks/           # Custom React Hooks (usePlayer, useTimer, usePlaylist)
├── lib/             # Utilities (utils.js)
├── pages/           # Next.js Pages & API Routes
└── styles/          # Global CSS (Tailwind directives)
```

## Key Modules & Logic

### 1. Timer Logic
- **Context:** `TimerContext` (`src/context/timerProvider.jsx`) manages the high-level timer state (Work vs Break, cycles).
- **Hook:** `useTimer` (`src/hooks/useTimer.jsx`) handles the countdown logic, intervals, and switching.
- **UI:** `TimersWithControllerContainer` orchestrates the timer display and controls.

### 2. Player & Video
- **Hook:** `usePlayer` (`src/hooks/usePlayer.jsx`) wraps the YouTube Player API. It exposes a `controller` function for actions (`play`, `pause`, `setVolume`, `toggleMute`).
- **Container:** `PlayerContainer` (`src/components/Organisms/player/playerContainer.jsx`) renders the video.
    - **Cinema Mode:** A responsive layout toggle that expands the video player (~75% width) and shrinks the playlist.
    - **Custom Controls:** A stylish control bar below the video with Play/Pause, Next/Prev, and Volume controls.

### 3. Playlist Management
- **Context:** `PlaylistContext` (`src/context/playlistProvider.jsx`) manages the lists of videos for Work/Break modes.
- **Storage:** Persists playlists to `localStorage`.
- **UI:** `PlaylistContainer` (`src/components/Organisms/playlist/playlistContainer.jsx`) handles the split-pane layout and tabs for switching playlists.

## Development Workflow

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Commands
- **Install Dependencies:**
  ```bash
  npm install
  ```
- **Start Development Server:**
  ```bash
  npm run dev
  ```
  Access at `http://localhost:3000`.
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Linting:**
  ```bash
  npm run lint
  ```

## Conventions
- **Component Design:** Prefer Atomic Design principles. Small, stateless components in `Atoms`/`Molecules`, stateful business logic in `Organisms` or `Context`.
- **Styling:** Use Tailwind CSS utility classes for layout and spacing. Use Mantine or custom CSS for complex interactive elements only if necessary.
- **State:**
    - Use **Jotai** (`atoms/atoms.ts`) for cross-cutting global state (e.g., player instance, global flags).
    - Use **Context** for feature-specific domain state (Timer logic, Playlist data).
- **Language:** **STRICTLY** use **Japanese** for all user-facing communication, especially in the final response and summary. Thinking process can be in English for performance, but the result must be in Japanese.
- **Responsiveness:** Ensure designs work on Mobile, Tablet (Portrait/Landscape), and Desktop. Use standard Tailwind breakpoints (`md`, `lg`, `xl`).
