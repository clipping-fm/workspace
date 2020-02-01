import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';
import DraggableContainer from 'components/DraggableContainer';

import { Layout } from 'types';
import { setViewportLeftPosition } from 'state/actions/workspaceActions';
import workspaceLayoutAttrsSelector from 'state/selectors/workspaceLayoutAttrs'; 

export const MinimapConstants = {
  HEIGHT: 56,
  HANDLE_BORDER: { width: 2, color: Colors.light }
};

type Props = {
  layout: Layout 
};

const Minimap = React.memo(({ layout }: Props) => {
  const dispatch = useDispatch();

  const { 
    viewportWidthSeconds, 
    viewportLeftPositionSeconds, 
    projectEndsAtSeconds 
  } = useSelector(workspaceLayoutAttrsSelector);

  const handleWidth = (viewportWidthSeconds / Math.max(viewportWidthSeconds, projectEndsAtSeconds)) * layout.width;
  const handleX = 
    viewportLeftPositionSeconds <= 0 ? 
    0 :
    (viewportLeftPositionSeconds / Math.max(viewportWidthSeconds, projectEndsAtSeconds)) * layout.width;

  let DRAG_DATA: null | { xOriginal: number, xDelta: number } = null;
  const didStartDraggingInstanceStart = function(event: any) {
    DRAG_DATA = { xOriginal: event.data.global.x, xDelta: 0 };
  };
  const didDragInstanceStart = function(this: any, event: any) {
    if (DRAG_DATA === null) return;
    DRAG_DATA = {
      ...DRAG_DATA,
      xDelta: event.data.global.x - DRAG_DATA.xOriginal,
    };
    const distanceMovedInSeconds = (DRAG_DATA.xDelta / layout.width) * Math.max(viewportWidthSeconds, projectEndsAtSeconds);
    dispatch(setViewportLeftPosition(
      Math.max(0, viewportLeftPositionSeconds + distanceMovedInSeconds)
    ));
  };
  const didStopDraggingInstanceStart = function(event: any) {
    if (DRAG_DATA === null) return;
    DRAG_DATA = null;
  };

  return (
    <Container>
      <Rectangle
        x={layout.x}
        y={layout.y}
        width={layout.width} 
        height={layout.height} 
        fill={Colors.mid}
      >
        <DraggableContainer
          onDragStart={didStartDraggingInstanceStart}
          onDragMove={didDragInstanceStart}
          onDragEnd={didStopDraggingInstanceStart}
        >
          <Rectangle
            x={handleX}
            y={0}
            width={handleWidth}
            height={layout.height}
            fill={Colors.light}
            alpha={0.1}
            border={MinimapConstants.HANDLE_BORDER}
          />
        </DraggableContainer>
      </Rectangle>
    </Container>
  );
});

export default Minimap;
