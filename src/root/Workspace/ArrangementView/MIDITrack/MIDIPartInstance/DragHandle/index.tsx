import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import DraggableContainer from 'components/DraggableContainer';
import Rectangle from 'shapes/Rectangle';
import System from 'constants/System';
import Colors from 'constants/Colors';
import {
  updateProjectAttribute,
  ProjectAttributeUpdater
} from 'state/actions/projectActions';
//import { 
//  pxToSecondsSelector
//} from 'state/selectors/workspaceLayoutAttrs'; 

type Props = {
};

const DragHandle = ({
}: Props) => {
  //const pxToSeconds: number = useSelector(pxToSecondsSelector);

  const dispatch = useDispatch();
  const onUpdate = (attrUpdater: ProjectAttributeUpdater) => {
    dispatch(updateProjectAttribute(attrUpdater));
  };

  // TODO: fix me
  // TODO: type me strictly
  const instanceStartVisualizer: any = useRef(null);

  let DRAG_DATA: null | {
    xOriginal: number;
    attrUpdater: null | ProjectAttributeUpdater;
  };

  const didStartDraggingInstanceStart = function(event: any) {
    DRAG_DATA = { xOriginal: event.data.global.x, attrUpdater: null };
  };

  const didDragInstanceStart = function(event: any) {
    //if (DRAG_DATA) {
    //  let newWidth = 0;

    //  const differenceInSeconds =
    //    (DRAG_DATA.xOriginal - event.data.global.x) * -1 * pxToSeconds;
    //  const gridOffsetSeconds =
    //    midiPartInstanceAST.startsAt % measureWidthSeconds;
    //  const currentlyOnGrid = gridOffsetSeconds === 0;

    //  if (currentlyOnGrid) {
    //    if (differenceInSeconds > 0) {
    //      newWidth =
    //        Math.ceil(differenceInSeconds / measureWidthSeconds) *
    //        measureWidthSeconds;
    //    } else if (differenceInSeconds < 0) {
    //      newWidth =
    //        Math.floor(differenceInSeconds / measureWidthSeconds) *
    //        measureWidthSeconds;
    //    }
    //  } else {
    //    if (differenceInSeconds > 0) {
    //      const fill = measureWidthSeconds - gridOffsetSeconds;
    //      newWidth =
    //        Math.ceil((differenceInSeconds - fill) / measureWidthSeconds) *
    //          measureWidthSeconds +
    //        fill;
    //    } else if (differenceInSeconds < 0) {
    //      const fill = gridOffsetSeconds;
    //      newWidth =
    //        (Math.floor((differenceInSeconds - fill) / measureWidthSeconds) +
    //          1) *
    //          measureWidthSeconds -
    //        fill;
    //    }
    //  }

    //  if (newWidth) {
    //    const newDuration = Transport.toBarsBeatsSixteenths(
    //      midiPartInstanceAST.duration - newWidth
    //    );
    //    const newTime = Transport.toBarsBeatsSixteenths(
    //      midiPartInstanceAST.startsAt + newWidth
    //    );

    //    let newOffset =
    //      ((newWidth % midiPartDuration) /
    //        midiPartDuration) *
    //        midiPartDuration +
    //      midiPartInstanceAST.offset;

    //    if (newOffset === midiPartDuration) {
    //      console.log("ho", newOffset % midiPartDuration);
    //      newOffset = 0;
    //    } else if (newOffset > midiPartDuration) {
    //      console.log("he", newOffset % midiPartDuration);
    //    } else if (newOffset < 0) {
    //      console.log("hey", newOffset % midiPartDuration);
    //    }

    //    DRAG_DATA.attrUpdater = {
    //      id: midiPartInstanceAST.id,
    //      type: "midiPartInstances",
    //      keyValuePairs: [
    //        {
    //          attribute: "duration",
    //          value: newDuration
    //        },
    //        {
    //          attribute: "time",
    //          value: newTime
    //        },
    //        {
    //          attribute: "offset",
    //          value: newOffset
    //        }
    //      ]
    //    };
    //  } else {
    //    DRAG_DATA.attrUpdater = null;
    //  }

    //  instanceStartVisualizer.current.width = newWidth / pxToSeconds;
    //}
  };

  const didStopDraggingInstanceStart = function() {
    instanceStartVisualizer.current.width = 0;
    if (DRAG_DATA && DRAG_DATA.attrUpdater) {
      onUpdate(DRAG_DATA.attrUpdater);
      DRAG_DATA = null;
    }
  };

  return (
    <DraggableContainer
      onDragStart={didStartDraggingInstanceStart}
      onDragMove={didDragInstanceStart}
      onDragEnd={didStopDraggingInstanceStart}
    >
      <Rectangle
        x={0}
        y={0}
        width={3}
        height={System.ui.trackHeight}
        fill={Colors.light}
        alpha={0.1}
      />
      <Rectangle
        ref={instanceStartVisualizer}
        x={0}
        y={0}
        width={0.1}
        height={System.ui.trackHeight}
        fill={Colors.light}
        alpha={0.5}
      />
    </DraggableContainer>
  );
};

export default DragHandle;
