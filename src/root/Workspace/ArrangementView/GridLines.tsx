import React, { memo } from 'react';
import Rectangle from 'shapes/Rectangle';
import times from 'utils/times';
import Colors from 'constants/Colors';

type Props = {
  height: number;
  projectWidthPx: number;
  measureWidthPx: number;
};

const GridLines = ({ height, projectWidthPx, measureWidthPx }: Props) => {
  let lines: JSX.Element[] = [];
  times(projectWidthPx / measureWidthPx, (i: number) => {
    lines = [
      ...lines,
      <Rectangle
        key={i}
        x={i * measureWidthPx}
        y={0}
        width={1}
        height={height}
        fill={Colors.mid}
      />,
    ];
  });
  return <>{lines}</>;
};

export default memo(GridLines);
