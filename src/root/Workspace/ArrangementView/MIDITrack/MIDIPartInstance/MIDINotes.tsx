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

const makeLoopedMIDINotes = (
  midiNotes: MIDINote[],
  midiPartInstanceDuration: number,
  midiPartDuration: number,
  midiPartInstanceOffset: number,
): MIDINote[] => {
  return Array.from(
    Array(Math.ceil(midiPartInstanceDuration / midiPartDuration)).keys()
  ).reduce((acc: MIDINote[], i: number) => {
    const loopedMIDINoteSet: MIDINote[] =
      midiNotes.map((midiNote: MIDINote) => {
        const time = 
          normalizeTime(midiNote.time) - midiPartInstanceOffset + (i * midiPartDuration);
        let duration = normalizeTime(midiNote.duration);
        const relativeEndTime = time + duration;

        /* Ensure the final note doesn't exceed the clip's duration */
        if (relativeEndTime > midiPartDuration) {
          duration = (duration - (relativeEndTime - midiPartDuration)); 
        }

        return {
          ...midiNote,
          id: `${i}__${midiNote.id}`,
          time,
          duration
        };
      }).filter(midiNote => {
        return normalizeTime(midiNote.time) >= 0 && normalizeTime(midiNote.time) < midiPartDuration;
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
  ).map(loopedMIDINote => {
    return (
      <Rectangle
        key={loopedMIDINote.id}
        x={normalizeTime(loopedMIDINote.time) / pxToSeconds}
        y={(maxMIDIValue - loopedMIDINote.midi) * noteHeight}
        width={normalizeTime(loopedMIDINote.duration) / pxToSeconds}
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
