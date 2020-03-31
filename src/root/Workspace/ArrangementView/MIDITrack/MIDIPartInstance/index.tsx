import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import System from 'constants/System';
import Colors from 'constants/Colors';
import LoopStartIndicators from './LoopStartIndicators';
import DragHandle from './DragHandle';
import MIDINotes from './MIDINotes';
import { MIDIPartInstance } from 'types';
import normalizeTime from 'utils/normalizeTime';
import { pxToSecondsSelector } from 'state/selectors/workspaceLayoutAttrs';

type Props = {
  midiPartInstance: MIDIPartInstance;
  midiPartDuration: number;
  maxMIDIValue: number;
  measureWidthSeconds: number;
  noteContainerYpx: number;
  noteHeight: number;
};

const MIDIPartInstanceComponent = ({
  midiPartInstance,
  midiPartDuration,
  maxMIDIValue,
  measureWidthSeconds,
  noteContainerYpx,
  noteHeight,
}: Props) => {
  const pxToSeconds: number = useSelector(pxToSecondsSelector);
  const midiPartInstanceOffset: number = normalizeTime(midiPartInstance.offset);
  const midiPartInstanceDuration: number = normalizeTime(
    midiPartInstance.duration
  );
  const instanceWidthPx: number = midiPartInstanceDuration / pxToSeconds;

  return (
    <Container
      x={normalizeTime(midiPartInstance.time) / pxToSeconds}
      y={0}
      interactive
      cursor="pointer"
      click={() => console.log('clicked instance')}
    >
      <Rectangle
        x={0}
        y={0}
        width={instanceWidthPx}
        height={System.ui.trackHeaderHeight}
        fill={Colors.light}
      />

      <Rectangle
        x={0}
        y={System.ui.trackHeaderHeight}
        width={instanceWidthPx}
        height={System.ui.noteContainerHeight}
        fill={Colors.mid}
        alpha={0.3}
      >
        <MIDINotes
          midiPartInstanceId={midiPartInstance.id}
          noteContainerYpx={noteContainerYpx}
          noteHeight={noteHeight}
          maxMIDIValue={maxMIDIValue}
          midiPartInstanceDuration={midiPartInstanceDuration}
          midiPartInstanceOffset={midiPartInstanceOffset}
          midiPartDuration={midiPartDuration}
        />
      </Rectangle>

      <LoopStartIndicators
        midiPartInstanceDuration={midiPartInstanceDuration}
        midiPartInstanceOffset={midiPartInstanceOffset}
        midiPartDuration={midiPartDuration}
      />

      <DragHandle />
    </Container>
  );
};

export default MIDIPartInstanceComponent;
