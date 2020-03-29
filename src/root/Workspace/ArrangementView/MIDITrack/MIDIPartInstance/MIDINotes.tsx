import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from "shapes/Rectangle";
import { ProjectState } from 'state/reducers/project';
import { GlobalState, MIDIPart, MIDIPartInstance, MIDINote } from "types";
import { 
  pxToSecondsSelector
} from 'state/selectors/workspaceLayoutAttrs'; 
import Colors from "constants/Colors";
import normalizeTime from 'utils/normalizeTime';

type Props = {
  midiPartInstanceId: string;
  noteContainerYpx: number;
  noteHeight: number;
  midiPartInstanceDuration: number;
  midiPartInstanceOffset: number;
  midiPartDuration: number;
  maxMIDIValue: number;
};

type LoopedMIDINote = {
  loopIndex: number,
  relativeTime: number;
  clampedDuration: number;
  midiNote: MIDINote;
};

const makeLoopedMIDINotes = (
  midiNotes: MIDINote[],
  midiPartInstanceDuration: number,
  midiPartDuration: number,
  midiPartInstanceOffset: number,
): LoopedMIDINote[] => {
  return Array.from(
    Array(Math.ceil(midiPartInstanceDuration / midiPartDuration)).keys()
  ).reduce((acc: LoopedMIDINote[], i: number) => {
    const loopedMIDINoteSet: LoopedMIDINote[] =
      midiNotes.map((midiNote: MIDINote) => {
        const relativeTime = 
          normalizeTime(midiNote.time) - midiPartInstanceOffset + (i * midiPartDuration);
        let clampedDuration = normalizeTime(midiNote.duration);
        const relativeEndTime = relativeTime + clampedDuration;

        /* Ensure the final note doesn't exceed the clip's duration */
        if (relativeEndTime > midiPartDuration) {
          clampedDuration = (clampedDuration - (relativeEndTime - midiPartDuration)); 
        }

        return {
          loopIndex: i,
          relativeTime,
          clampedDuration,
          midiNote
        };
      }).filter(loopedMIDINote => {
        return loopedMIDINote.relativeTime >= 0 && loopedMIDINote.relativeTime < midiPartDuration;
      });

    return [...acc, ...loopedMIDINoteSet];
  }, []);
};

const MIDINotes = ({
  midiPartInstanceId,
  noteContainerYpx,
  noteHeight,
  midiPartInstanceDuration,
  midiPartInstanceOffset,
  midiPartDuration,
  maxMIDIValue
}: Props) => {
  const pxToSeconds: number = useSelector(pxToSecondsSelector);
  const projectState: ProjectState = useSelector((state: GlobalState) => state.project);
  const midiPartInstance: MIDIPartInstance = projectState.midiPartInstances[midiPartInstanceId];
  const midiPart: MIDIPart = projectState.midiParts[midiPartInstance.midiPartId];
  const midiNotes: MIDINote[] = midiPart.midiNoteIds.map(id => projectState.midiNotes[id]);

  const partNotes = makeLoopedMIDINotes(
    midiNotes,
    midiPartInstanceDuration,
    midiPartDuration,
    midiPartInstanceOffset,
  ).map((loopedMIDINote: LoopedMIDINote) => {
    return (
      <Rectangle
        key={`${loopedMIDINote.loopIndex}__${loopedMIDINote.midiNote.id}`}
        x={loopedMIDINote.relativeTime / pxToSeconds}
        y={(maxMIDIValue - loopedMIDINote.midiNote.midi) * noteHeight}
        width={normalizeTime(loopedMIDINote.clampedDuration) / pxToSeconds}
        height={noteHeight}
        fill={Colors.highlight}
      />
    );
  });
  
  return( 
    <Container y={noteContainerYpx}>
      {partNotes}
    </Container>
  );
};

export default MIDINotes;
