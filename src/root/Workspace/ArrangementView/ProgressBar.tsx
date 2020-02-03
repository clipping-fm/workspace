import React, { memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';
import { usePixiTicker } from 'utils/pixiContext';
import Transport from 'lib/Transport';
import { pxToSecondsSelector } from 'state/selectors/workspaceLayoutAttrs'; 

type Props = {
  height: number
};

const ProgressBar = ({
  height
}: Props) => {
  const pxToSeconds: number = useSelector(pxToSecondsSelector);

  // TODO: type me strictly 
  const progressBarRef: any = useRef(null);
  usePixiTicker(() => {
    progressBarRef.current.x = Transport.positionInSeconds / pxToSeconds;
  });

  return (
    <Rectangle
      ref={progressBarRef}
      x={0}
      y={0}
      width={1}
      height={height}
      fill={Colors.light}
    />
  );
};

export default memo(ProgressBar);
