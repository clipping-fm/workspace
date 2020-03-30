import React from 'react';
import { useSelector } from 'react-redux';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';
import System from 'constants/System';
import { pxToSecondsSelector } from 'state/selectors/workspaceLayoutAttrs';

type Props = {
  midiPartInstanceDuration: number;
  midiPartInstanceOffset: number;
  midiPartDuration: number;
};

const LoopStartIndicators = ({
  midiPartInstanceDuration,
  midiPartInstanceOffset,
  midiPartDuration,
}: Props) => {
  const pxToSeconds: number = useSelector(pxToSecondsSelector);

  const loopStartPositions = Array.from(
    Array(Math.ceil(midiPartInstanceDuration / midiPartDuration)).keys()
  )
    .map((i: number) => {
      return (i * midiPartDuration - midiPartInstanceOffset) / pxToSeconds;
    })
    .filter((lsp: number) => lsp >= 0);

  return (
    <>
      {loopStartPositions.map((positionInPx, i) => {
        return (
          <Rectangle
            key={`loop-indicator-${i}`}
            x={positionInPx}
            y={0}
            width={1}
            height={System.ui.trackHeight}
            fill={Colors.highlight}
          />
        );
      })}
    </>
  );
};

export default LoopStartIndicators;
