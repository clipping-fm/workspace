import React from "react";
import normalizeTime from 'utils/normalizeTime';
import { useSelector } from "react-redux";
import System from "constants/System";
import MIDIPartInstanceComponent from "./MIDIPartInstance";
import { GlobalState, MIDITrack, MIDIPart, MIDIPartInstance, MIDINote } from "types";
import {
  measureWidthSecondsSelector
} from "state/selectors/workspaceLayoutAttrs";
import { ProjectState } from 'state/reducers/project';

type Props = {
  midiTrackId: string
};

/* Find the talest possible note block */
const POSSIBLE_NOTE_HEIGHTS = [4, 3, 2, 1, 0.5];
function largestNoteHeightForRangeClicks(rangeClicks: number): number {
  return POSSIBLE_NOTE_HEIGHTS.reduce((acc, noteHeight) => {
    if (System.ui.noteContainerHeight / acc >= rangeClicks) return acc;
    return noteHeight;
  }, POSSIBLE_NOTE_HEIGHTS[0]);
}

const MIDITrackComponent = React.memo(({ midiTrackId }: Props) => {
  console.log(`~~> render <MIDITrack id={${midiTrackId}} />`);

  const projectState: ProjectState = useSelector((state: GlobalState) => state.project);
  const midiTrack: MIDITrack = projectState.tracks[midiTrackId];
  const midiParts: MIDIPart[] = midiTrack.midiPartIds.map(id => projectState.midiParts[id]);

  const measureWidthSeconds = useSelector(measureWidthSecondsSelector);

  const partElements: JSX.Element[] = midiParts.reduce(
    (acc: JSX.Element[], midiPart: MIDIPart) => {
      const midiPartDuration: number = normalizeTime(midiPart.duration);
      // Loop through and find the best note height for the part by checking
      // the rangeClicks can fit in the given height. In the case of a 0.5
      // height, just let it overflow.
      const midiPartInstances: MIDIPartInstance[] = midiPart.midiPartInstanceIds.map(id => projectState.midiPartInstances[id]);
      const midiNotes: MIDINote[] = midiPart.midiNoteIds.map(id => projectState.midiNotes[id]);
      const midiValues: number[] = midiNotes.map(midiNote => midiNote.midi);
      const minMIDIValue: number = Math.min(...midiValues);
      const maxMIDIValue: number = Math.max(...midiValues);
      const rangeClicks = maxMIDIValue - minMIDIValue;
      const noteHeight = largestNoteHeightForRangeClicks(rangeClicks);

      // Vertically center notes in the note container
      const totalHeightOfNotes = rangeClicks * noteHeight;
      const noteContainerYpx =
        totalHeightOfNotes < System.ui.noteContainerHeight
          ? (System.ui.noteContainerHeight - totalHeightOfNotes) / 2
          : 0;

      // TODO: Clipping mask the NOTE_CONTAINER for rare case when rangeClicks is over 240
      const instances = midiPartInstances.map(
        (midiPartInstance: MIDIPartInstance) => {
          return (
            <MIDIPartInstanceComponent
              key={midiPartInstance.id}
              midiPartDuration={midiPartDuration}
              midiPartInstance={midiPartInstance}
              maxMIDIValue={maxMIDIValue}
              measureWidthSeconds={measureWidthSeconds}
              noteContainerYpx={noteContainerYpx}
              noteHeight={noteHeight}
            />
          );
        }
      );

      return [...acc, ...instances];
    },
    []
  );

  return <>{partElements}</>;
});

export default MIDITrackComponent;
