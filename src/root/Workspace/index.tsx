import React, { memo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ArrangementView from 'root/Workspace/ArrangementView';
import ScrollableContainer from 'components/ScrollableContainer';

import { Layout } from 'types';
import { pxToSecondsSelector, viewportLeftPositionSecondsSelector } from 'state/selectors/workspaceLayoutAttrs'; 
import { setViewportLeftPosition } from 'state/actions/workspaceActions';

type Props = {
  layout: Layout 
};

const Workspace = ({ layout }: Props) => {
  const dispatch = useDispatch();

  const pxToSeconds: number = useSelector(pxToSecondsSelector);
  const viewportLeftPositionSeconds: number = useSelector(viewportLeftPositionSecondsSelector);

  // TODO: better typings
  const scrollableContainerRef: any = useRef(null);
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
      <ArrangementView layout={layout} /> 
    </ScrollableContainer>
  );
};

export default memo(Workspace);
