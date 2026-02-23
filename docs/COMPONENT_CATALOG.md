# Component Catalog

This document provides a summary of the key UI components and their responsibilities.

## 1. Organisms (`src/components/Organisms`)
Complex sections that connect business logic and state.

| Name | Description | Key State/Props |
| :--- | :--- | :--- |
| `Header` | Application header with title and theme toggle. | `useAtom(modeAtom)` (Jotai) |
| `PlayerContainer` | **Core** - Handles video playback logic. Wraps `Player` component. | `usePlayer`, `PlaylistContext` |
| `PlaylistContainer` | **Core** - Displays playlist tabs and video lists. | `PlaylistContext` |
| `TimerContainer` | **Core** - Displays the active timer and controls. | `TimerContext` |
| `TimersWithControllerContainer` | **Wrapper** - Coordinates the timer display and control bar. | `TimerContext` |
| `TutorialContainer` | Introduction overlay for new users. | `useLocalStorage` |

## 2. Molecules (`src/components/Molecules`)
Compound components that form functional units.

| Name | Description | Key State/Props |
| :--- | :--- | :--- |
| `Player` | `react-youtube` wrapper for the IFrame API. | `onReady`, `onStateChange`, `opts` |
| `Controller` | Custom control bar (Play, Pause, Volume) for the player. | `usePlayer` |
| `PlaylistTabs` | Tabs for switching between "Work" and "Break" playlists. | `PlaylistContext` |
| `TimerCountdown` | Circular progress bar visualization of the timer. | `useTimer` |
| `TimerControls` | Buttons for Start, Pause, Reset, Skip. | `TimerContext` |
| `TimerSetting` | Input fields (Range Sliders) for setting timer duration. | `TimerContext` |

## 3. Atoms (`src/components/Atoms`)
Stateless, reusable building blocks.

| Name | Description | Key Props |
| :--- | :--- | :--- |
| `ControlButton` | Generic button for player controls. | `icon`, `onClick`, `label` |
| `TimerControlButton` | Styled button for timer controls. | `icon`, `onClick`, `variant` |

## 4. UI Components (`src/components/ui`)
Reusable, styled components (shadcn/ui based).

| Name | Description | Key Props |
| :--- | :--- | :--- |
| `Button` | Standard button component. | `variant`, `size` |
| `Slider` | Range slider input (Mantine UI or custom). | `value`, `onChange`, `min`, `max` |
| `Toast` | Notification component. | `title`, `description` |
| `Dialog` | Modal dialog component. | `open`, `onOpenChange` |

## 5. Templates (`src/components/Templates`)
Page layouts.

| Name | Description | Key Props |
| :--- | :--- | :--- |
| `TimerVid` | Main application layout. Structures the Header, Player, Timer, and Playlist areas. | None (Connects to Organisms) |
