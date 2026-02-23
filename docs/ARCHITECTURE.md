# Architecture & Design

## Overview
TimerVid is a productivity application that combines a Pomodoro timer with a YouTube video player. It allows users to set different playlists for "Work" and "Break" sessions, creating a seamless workflow with background music or visual ambience.

## Tech Stack
- **Framework:** Next.js 14 (Pages Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS, Mantine UI, shadcn/ui
- **State Management:** Jotai (Global), React Context (Feature-scoped)
- **Video Player:** `react-youtube` (Wrapper for YouTube IFrame API)
- **Icons:** `react-icons`

## Directory Structure
The project follows a hybrid structure combining Next.js conventions with Atomic Design.

```
src/
├── atoms/           # Global State (Jotai)
├── components/      # UI Components (Atomic Design)
│   ├── Atoms/       # Basic building blocks (Buttons, Inputs)
│   ├── Molecules/   # Compound components (Player controls, Timer display)
│   ├── Organisms/   # Complex sections (PlayerContainer, PlaylistContainer)
│   ├── Templates/   # Page layouts
│   └── ui/          # Reusable UI components (shadcn/ui)
├── context/         # Feature-scoped State (Timer, Playlist)
├── hooks/           # Custom React Hooks (Logic encapsulation)
├── lib/             # Utilities
├── pages/           # Next.js Routes
└── styles/          # Global Styles
```

## Core Concepts

### 1. Hybrid State Management
The application uses a hybrid approach to state management:
- **Jotai (`src/atoms/`)**: Used for cross-cutting global state that needs to be accessed anywhere (e.g., Player instance, Current Mode, Resume Time).
- **React Context (`src/context/`)**: Used for domain-specific state that involves complex logic and multiple related values (e.g., Timer logic, Playlist management).

### 2. Logic Encapsulation via Hooks
Complex logic is encapsulated in custom hooks:
- `useTimer`: Manages countdown logic, intervals, and localStorage persistence for a single timer.
- `usePlaylist`: Manages a list of videos, current index, and localStorage persistence.
- `usePlayer`: Wraps the YouTube Player API, exposing a unified `controller` interface.

### 3. Atomic Design
UI components are organized according to Atomic Design principles to promote reusability and maintainability.
- **Atoms**: Stateless, single-purpose components.
- **Molecules**: Combinations of atoms that form a functional unit.
- **Organisms**: Complex sections that may contain business logic or connect to State/Context.
- **Templates**: Page-level layouts.

## Data Flow
1. **User Interaction**: User clicks "Start" on the Timer.
2. **Context Update**: `TimerContext` updates `isRunning` state.
3. **Side Effect**: `useEffect` in `TimerProvider` detects timer start and dispatches `play` command to `usePlayer`.
4. **Global State**: `usePlayer` interacts with the YouTube Player instance stored in `playerAtom`.
5. **UI Update**: Player component renders the video and updates progress.
