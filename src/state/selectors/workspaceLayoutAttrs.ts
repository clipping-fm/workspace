import { createSelector } from 'reselect';
import { GlobalState } from 'types';
import { MIDIPartInstance } from 'types';
import Transport from 'lib/Transport';

export default createSelector(
  (state: GlobalState) => state.transport.bpm,
  (state: GlobalState) => state.workspace.layout.width,
  (state: GlobalState) => state.workspace.viewportWidthSeconds,
  (state: GlobalState) => state.workspace.viewportLeftPositionSeconds,
  (state: GlobalState) => state.project.midiPartInstances,
  (
    bpm: number, 
    viewportWidthPx: number, 
    viewportWidthSeconds: number, 
    viewportLeftPositionSeconds: number, 
    midiPartInstances: { [id: string]: MIDIPartInstance }
  ) => {
    const pxToSeconds: number = viewportWidthSeconds / viewportWidthPx;
    const beatEverySeconds: number = 60 / bpm;
    const measureWidthSeconds: number =  beatEverySeconds * 4;

    const projectEndsAtSeconds = Object.values(midiPartInstances).reduce((acc: number, midiPartInstance: MIDIPartInstance) => {
      const instanceEndsAt = Transport.toSeconds(midiPartInstance.time) + Transport.toSeconds(midiPartInstance.duration);
      return instanceEndsAt > acc ? instanceEndsAt : acc;
    }, 0);

    return {
      pxToSeconds,
      measureWidthSeconds,
      viewportWidthSeconds,
      viewportLeftPositionSeconds,
      projectEndsAtSeconds,
      measureWidthPx: measureWidthSeconds / pxToSeconds
    }
  }
);
