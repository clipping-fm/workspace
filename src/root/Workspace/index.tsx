import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePixiTicker } from 'utils/pixiContext';
import Transport from 'lib/Transport';

import MIDITrack from 'root/Workspace/MIDITrack';
import ScrollableContainer from 'components/ScrollableContainer';
import Rectangle from 'shapes/Rectangle';
import System from 'constants/System';
import Colors from 'constants/Colors';
import times from 'utils/times';

import { GlobalState, Layout, } from 'types';
import { ProjectAST, MIDITrackAST } from 'lib/Project';
import workspaceLayoutAttrsSelector from 'state/selectors/workspaceLayoutAttrs'; 
import { setViewportLeftPosition } from 'state/actions/workspaceActions';

type Props = {
  layout: Layout 
};

type GridLinesProps = {
  height: number,
  projectWidthPx: number,
  measureWidthPx: number
};

const GridLines = React.memo(({
  height,
  projectWidthPx,
  measureWidthPx
}: GridLinesProps) => {
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
      />
    ];
  });
  return <>{lines}</>;
});

export default React.memo(({ layout }: Props) => {
  const dispatch = useDispatch();
  const projectAST: ProjectAST = useSelector((state: GlobalState) => state.workspace.projectAST);
  const { 
    measureWidthPx, 
    pxToSeconds,
    viewportLeftPositionSeconds
  } = useSelector(workspaceLayoutAttrsSelector);

  // TODO: type me strictly 
  const progressBarRef: any = useRef(null);
  const scrollableContainerRef: any = useRef(null);

  usePixiTicker(() => {
    progressBarRef.current.x = Transport.positionInSeconds / pxToSeconds;
  });

  if (scrollableContainerRef && scrollableContainerRef.current) {
    scrollableContainerRef.current.content.moveCorner(
      viewportLeftPositionSeconds / pxToSeconds, 
      scrollableContainerRef.current.content.corner.y
    );
  }

  const onViewportMove = (viewportCorner: PIXI.Point) => {
    dispatch(setViewportLeftPosition(viewportCorner.x * pxToSeconds));
  };

  console.log('render <Workspace />');
  return (
    <ScrollableContainer
      width={layout.width} 
      height={layout.height}
      x={layout.x}
      y={layout.y}
      onMove={onViewportMove}
      ref={scrollableContainerRef}
    >
    
      <GridLines 
        height={Math.max(layout.height, projectAST.tracks.length * System.ui.trackHeight)}
        projectWidthPx={layout.width}
        measureWidthPx={measureWidthPx}
      />

      <Rectangle
        ref={progressBarRef}
        x={0}
        y={0}
        width={1}
        height={Math.max(layout.height, projectAST.tracks.length * System.ui.trackHeight)}
        fill={Colors.light}
      />

      {projectAST.tracks.map((midiTrackAST: MIDITrackAST) => {
        return <MIDITrack key={midiTrackAST.id} midiTrackAST={midiTrackAST} workspaceLayout={layout} />;
      })}

    </ScrollableContainer>
  );
});
