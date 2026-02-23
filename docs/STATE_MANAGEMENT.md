# State Management

## Overview
The application uses a hybrid state management approach combining **Jotai** for global UI state and **React Context** for domain logic.

## 1. Global State (Jotai Atoms)
Defined in `src/atoms/atoms.ts`.

| Atom Name | Type | Description |
| :--- | :--- | :--- |
| `playerAtom` | `YouTubePlayer \| null` | Stores the YouTube Player instance. Used by `usePlayer` to control playback. |
| `isPlayingAtom` | `boolean` | Tracks if the video is currently playing. |
| `isTimerVisibleAtom` | `boolean` | Controls visibility of the timer overlay (e.g., in cinema mode). |
| `modeAtom` | `'work' \| 'break'` | Current application mode. Toggled by `PlaylistContext`. |
| `resumeTimeBaseAtom` | `{ work: number, break: number }` | Stores the last playback position for each mode. |
| `resumeTimeAtom` | `number` (Derived) | Get/Set the resume time for the *current* mode. |

## 2. Timer Context (`TimerContext`)
Managed in `src/context/timerProvider.jsx`.
Handles the Pomodoro timer logic, cycles, and sound effects.

**State:**
- `workTimer`: `useTimer` instance (Work duration)
- `breakTimer`: `useTimer` instance (Short break duration)
- `longBreakTimer`: `useTimer` instance (Long break duration)
- `currentTimer`: Reference to the currently active timer.
- `totalCycle`, `longBreakCycle`: User settings for cycle counts.
- `totalCycleCount`, `longBreakCycleCount`: Progress tracking.

**Key Functions:**
- `startTimer()`: Toggles play/pause for the current timer and video.
- `clearTimer()`: Resets all timers and cycle counts.
- `handleTimerEnd(current, next)`: Handles transition between timers, plays sound, and calls `switchStatus`.

## 3. Playlist Context (`PlaylistContext`)
Managed in `src/context/playlistProvider.jsx`.
Handles video playlists for work and break modes.

**State:**
- `workPlaylist`: `usePlaylist` instance (Work videos)
- `breakPlaylist`: `usePlaylist` instance (Break videos)
- `isWorking`: `boolean` (Derived from mode) - Determines active playlist.
- `currentVideoId`: `string` (Derived) - Video ID to play based on `isWorking`.

**Key Functions:**
- `switchStatus()`: Toggles between Work/Break modes. Saves current video time to `resumeTimeAtom`.
- `nextVideo()`, `prevVideo()`: Navigates the active playlist.
- `addVideoToPlaylist(url)`: Adds a video to the active playlist (via `usePlaylist`).

## 4. Hook Dependencies & Data Flow

### `usePlayer` Hook
- **Reads**: `playerAtom`
- **Writes**: `playerAtom`, `isPlayingAtom`
- **Exposes**: `controller({ type, payload })` function.
  - `play/pause`: Toggles video playback.
  - `loadVideoId`: Loads a new video, optionally seeking to `resumeTimeAtom`.
  - `setVolume`: Sets volume.
  - `toggleMute`: Toggles mute.

### Timer -> Player Integration
When a timer starts/stops:
1. `TimerContext` updates `timer.isRunning`.
2. `TimerProvider`'s `startTimer` calls `controller({ type: "play/pause" })`.
3. `usePlayer` interacts with the YouTube API.

### Timer -> Playlist Integration
When a timer ends:
1. `TimerContext` calls `handleTimerEnd`.
2. `handleTimerEnd` calls `PlaylistContext.switchStatus()`.
3. `switchStatus`:
   - Saves current playback time to `resumeTimeAtom`.
   - Toggles `isWorking` state.
   - Updates `modeAtom`.
   - Result: `currentVideoId` changes, triggering `PlayerContainer` to load the new video.
