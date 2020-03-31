import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import { ProjectState } from 'state/reducers/project';
import {
  GlobalState,
  MIDIPart,
  MIDIPartInstance,
  MIDINote,
  LoopedMIDINote,
} from 'types';
import { pxToSecondsSelector } from 'state/selectors/workspaceLayoutAttrs';
import Colors from 'constants/Colors';
import makeLoopedMIDINotes from 'utils/makeLoopedMIDINotes';

type Props = {
  midiPartInstanceId: string;
  noteContainerYpx: number;
  noteHeight: number;
  midiPartInstanceDuration: number;
  midiPartInstanceOffset: number;
  midiPartDuration: number;
  maxMIDIValue: number;
};

const MIDINotes = ({
  midiPartInstanceId,
  noteContainerYpx,
  noteHeight,
  midiPartInstanceDuration,
  midiPartInstanceOffset,
  midiPartDuration,
  maxMIDIValue,
}: Props) => {
  const pxToSeconds: number = useSelector(pxToSecondsSelector);
  const projectState: ProjectState = useSelector(
    (state: GlobalState) => state.project
  );
  const midiPartInstance: MIDIPartInstance =
    projectState.midiPartInstances[midiPartInstanceId];
  const midiPart: MIDIPart =
    projectState.midiParts[midiPartInstance.midiPartId];
  const midiNotes: MIDINote[] = midiPart.midiNoteIds.map(
    (id) => projectState.midiNotes[id]
  );

  const partNotes = makeLoopedMIDINotes(
    midiNotes,
    midiPartInstanceDuration,
    midiPartDuration,
    midiPartInstanceOffset
  ).map((loopedMIDINote: LoopedMIDINote) => {
    return (
      <Rectangle
        key={`${loopedMIDINote.loopIndex}__${loopedMIDINote.midiNote.id}`}
        x={loopedMIDINote.relativeTime / pxToSeconds}
        y={(maxMIDIValue - loopedMIDINote.midiNote.midi) * noteHeight}
        width={loopedMIDINote.clampedDuration / pxToSeconds}
        height={noteHeight}
        fill={Colors.highlight}
      />
    );
  });

  return <Container y={noteContainerYpx}>{partNotes}</Container>;
};

export default MIDINotes;
