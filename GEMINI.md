# TimerVid Project Context

## Project Overview
TimerVid is a productivity web application that combines a Pomodoro timer with YouTube video playback. Users can set different playlists for "Work" and "Break" sessions, allowing for a seamless workflow with background music or visual ambience.

**Key Features:**
- **Pomodoro Timer:** Customizable work/break cycles.
- **YouTube Integration:** Background video playback with playlist management.
- **Dual Playlists:** Separate playlists for focus (work) and relaxation (break).
- **Responsive Layout:** Tablet/Desktop optimized with a "Cinema Mode" for immersive viewing.
- **Audio Feedback:** Sound effects for timer events.

## Documentation
For detailed implementation guides and architecture, refer to the `docs/` directory:

- [Architecture & Design](docs/ARCHITECTURE.md): Directory structure, tech stack, and design patterns.
- [State Management](docs/STATE_MANAGEMENT.md): Detailed map of Jotai Atoms, Context providers, and data flow.
- [Component Catalog](docs/COMPONENT_CATALOG.md): Overview of key UI components (Organisms, Molecules, Atoms).

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (v14, Pages Router)
- **Language:** JavaScript (ES6+) / React (v18)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Mantine UI](https://mantine.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Jotai](https://jotai.org/) (Global Atoms), React Context API (Feature-scoped)
- **Video:** `react-youtube` wrapper for YouTube IFrame API.
- **Icons:** `react-icons` (FontAwesome 6, etc.)

## Development Workflow

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Commands
- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev` (http://localhost:3000)
- **Build for Production:** `npm run build`
- **Linting:** `npm run lint`

## Conventions
- **Component Design:** Prefer Atomic Design principles. Small, stateless components in `Atoms`/`Molecules`, stateful business logic in `Organisms` or `Context`.
- **Styling:** Use Tailwind CSS utility classes for layout and spacing. Use Mantine or custom CSS for complex interactive elements only if necessary.
- **State:**
    - Use **Jotai** (`atoms/atoms.ts`) for cross-cutting global state (e.g., player instance, global flags).
    - Use **Context** for feature-specific domain state (Timer logic, Playlist data).
- **Language:** **STRICTLY** use **Japanese** for all user-facing communication, especially in the final response and summary. Thinking process can be in English for performance, but the result must be in Japanese.
- **Responsiveness:** Ensure designs work on Mobile, Tablet (Portrait/Landscape), and Desktop. Use standard Tailwind breakpoints (`md`, `lg`, `xl`).

## Git Workflow & Commit Guidelines
- **Atomic Commits:** Break down changes into small, self-contained commits. Each commit should represent a single logical unit of work (e.g., one feature, one bug fix, one refactor). Avoid batching unrelated changes into a single "bulk" commit.
- **Verification:** ALWAYS run `git status` and `git diff` (or `git diff --staged`) before committing to verify exactly what is being staged. Ensure no unintended files are included. **Also, run `npm run build` to ensure the application builds successfully before completing the task.**
- **Message Convention:** **STRICTLY** use **Japanese** for commit messages, following the Conventional Commits pattern (e.g., `feat: シアターモードのトグルを追加`, `fix: タイマーのハイドレーションエラーを修正`). Ensure messages are clear and descriptive.
- **Proactivity:** When a sub-task or logical step is completed and verified, propose a commit immediately rather than waiting for the entire session's work to finish.
