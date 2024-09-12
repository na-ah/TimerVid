import { atom } from "jotai";

export const playerAtom = atom(null);
export const modeAtom = atom("work");
export const resumeTimeBaseAtom = atom({ work: 0, break: 0 });
export const resumeTimeAtom = atom(
  (get) => {
    const mode = get(modeAtom);
    const resumeTimeBase = get(resumeTimeBaseAtom);
    return resumeTimeBase[mode];
  },
  (get, set, update) => {
    const mode = get(modeAtom);
    set(resumeTimeBaseAtom, (prev) => ({
      ...prev,
      [mode]: update,
    }));
  }
);
