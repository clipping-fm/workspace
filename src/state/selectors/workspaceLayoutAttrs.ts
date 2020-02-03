import { createSelector } from 'reselect';
import { GlobalState } from 'types';
import { MIDIPartInstance } from 'types';
import Transport from 'lib/Transport';

export const pxToSecondsSelector = createSelector(
  (state: GlobalState) => state.workspace.layout.width,
  (state: GlobalState) => state.workspace.viewportWidthSeconds,
  (viewportWidthPx: number, viewportWidthSeconds: number) => {
    return viewportWidthSeconds / viewportWidthPx;
  }
);

export const viewportWidthSecondsSelector = createSelector(
  (state: GlobalState) => state.workspace.viewportWidthSeconds,
  (viewportWidthSeconds: number) => {
    return viewportWidthSeconds;
  }
);

export const projectEndsAtSecondsSelector = createSelector(
  (state: GlobalState) => state.project.midiPartInstances,
  (midiPartInstances: { [id: string]: MIDIPartInstance }) => {
    const projectEndsAtSeconds = Object.values(midiPartInstances).reduce((acc: number, midiPartInstance: MIDIPartInstance) => {
      const instanceEndsAt = Transport.toSeconds(midiPartInstance.time) + Transport.toSeconds(midiPartInstance.duration);
      return instanceEndsAt > acc ? instanceEndsAt : acc;
    }, 0);
    return projectEndsAtSeconds;
  }
);

export const projectEndsAtPxSelector = createSelector(
  pxToSecondsSelector,
  projectEndsAtSecondsSelector,
  (pxToSeconds: number, projectEndsAtSeconds: number) => {
    return projectEndsAtSeconds / pxToSeconds;
  }
);

export const viewportLeftPositionSecondsSelector = createSelector(
  (state: GlobalState) => state.workspace.viewportLeftPositionSeconds,
  (viewportLeftPositionSeconds: number) => {
    return viewportLeftPositionSeconds;
  }
);

export const measureWidthSecondsSelector = createSelector(
  (state: GlobalState) => state.transport.bpm,
  (bpm: number) => {
    const beatEverySeconds: number = 60 / bpm;
    return beatEverySeconds * 4; // TODO: Time Signatures
  }
);

export const measureWidthPxSelector = createSelector(
  pxToSecondsSelector,
  measureWidthSecondsSelector,
  (pxToSeconds: number, measureWidthSeconds: number) => {
    return measureWidthSeconds / pxToSeconds;
  }
);
