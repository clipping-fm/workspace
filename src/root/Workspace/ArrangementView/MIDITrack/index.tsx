import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-pixi-fiber";
import Rectangle from "shapes/Rectangle";
import Colors from "constants/Colors";
import System from "constants/System";
import DraggableContainer from "components/DraggableContainer";
import Transport from "lib/Transport";
import {
  updateProjectAttribute,
  ProjectAttributeUpdater
} from "state/actions/projectActions";

import { Layout } from "types";
import { MIDITrackAST, MIDIPartAST, MIDIPartInstanceAST } from "lib/Project";
import {
  pxToSecondsSelector,
  measureWidthSecondsSelector
} from "state/selectors/workspaceLayoutAttrs";

type Props = {
  midiTrackAST: MIDITrackAST;
  workspaceLayout: Layout;
};

const HEADER_HEIGHT = 20;
const NOTE_CONTAINER_HEIGHT = System.ui.trackHeight - HEADER_HEIGHT;
const POSSIBLE_NOTE_HEIGHTS = [4, 3, 2, 1, 0.5];

function largestNoteHeightForRangeClicks(rangeClicks: number): number {
  return POSSIBLE_NOTE_HEIGHTS.reduce((acc, noteHeight) => {
    if (NOTE_CONTAINER_HEIGHT / acc >= rangeClicks) return acc;
    return noteHeight;
  }, POSSIBLE_NOTE_HEIGHTS[0]);
}

type MIDIPartInstanceProps = {
  midiPartAST: MIDIPartAST;
  midiPartInstanceAST: MIDIPartInstanceAST;
  measureWidthSeconds: number;
  noteContainerYpx: number;
  noteHeight: number;
  pxToSeconds: number;
  onUpdate: (attrUpdate: ProjectAttributeUpdater) => void;
};

const MIDIPartInstance = ({
  midiPartAST,
  midiPartInstanceAST,
  measureWidthSeconds,
  noteContainerYpx,
  noteHeight,
  pxToSeconds,
  onUpdate
}: MIDIPartInstanceProps) => {
  const instanceWidthPx = midiPartInstanceAST.duration / pxToSeconds;

  const loopStartIndicators = midiPartInstanceAST.loopStartPositions.map(
    (positionInSeconds, i) => {
      return (
        <Rectangle
          key={`loop-indicator-${i}`}
          x={positionInSeconds / pxToSeconds}
          y={0}
          width={1}
          height={System.ui.trackHeight}
          fill={Colors.highlight}
        />
      );
    }
  );

  const partNotes = midiPartInstanceAST.midiNotes.map(midiNoteAST => {
    return (
      <Rectangle
        key={midiNoteAST.id}
        x={midiNoteAST.startsAt / pxToSeconds}
        y={(midiPartAST.valueRange[1] - midiNoteAST.value) * noteHeight}
        width={midiNoteAST.duration / pxToSeconds}
        height={noteHeight}
        fill={Colors.highlight}
      />
    );
  });

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
    if (DRAG_DATA) {
      let newWidth = 0;

      const differenceInSeconds =
        (DRAG_DATA.xOriginal - event.data.global.x) * -1 * pxToSeconds;
      const gridOffsetSeconds =
        midiPartInstanceAST.startsAt % measureWidthSeconds;
      const currentlyOnGrid = gridOffsetSeconds === 0;

      if (currentlyOnGrid) {
        if (differenceInSeconds > 0) {
          newWidth =
            Math.ceil(differenceInSeconds / measureWidthSeconds) *
            measureWidthSeconds;
        } else if (differenceInSeconds < 0) {
          newWidth =
            Math.floor(differenceInSeconds / measureWidthSeconds) *
            measureWidthSeconds;
        }
      } else {
        if (differenceInSeconds > 0) {
          const fill = measureWidthSeconds - gridOffsetSeconds;
          newWidth =
            Math.ceil((differenceInSeconds - fill) / measureWidthSeconds) *
              measureWidthSeconds +
            fill;
        } else if (differenceInSeconds < 0) {
          const fill = gridOffsetSeconds;
          newWidth =
            (Math.floor((differenceInSeconds - fill) / measureWidthSeconds) +
              1) *
              measureWidthSeconds -
            fill;
        }
      }

      if (newWidth) {
        const newDuration = Transport.toBarsBeatsSixteenths(
          midiPartInstanceAST.duration - newWidth
        );
        const newTime = Transport.toBarsBeatsSixteenths(
          midiPartInstanceAST.startsAt + newWidth
        );

        let newOffset =
          ((newWidth % midiPartInstanceAST.partDuration) /
            midiPartInstanceAST.partDuration) *
            midiPartInstanceAST.partDuration +
          midiPartInstanceAST.offset;

        if (newOffset === midiPartInstanceAST.partDuration) {
          console.log("ho", newOffset % midiPartInstanceAST.partDuration);
          newOffset = 0;
        } else if (newOffset > midiPartInstanceAST.partDuration) {
          console.log("he", newOffset % midiPartInstanceAST.partDuration);
        } else if (newOffset < 0) {
          console.log("hey", newOffset % midiPartInstanceAST.partDuration);
        }

        DRAG_DATA.attrUpdater = {
          id: midiPartInstanceAST.id,
          type: "midiPartInstances",
          keyValuePairs: [
            {
              attribute: "duration",
              value: newDuration
            },
            {
              attribute: "time",
              value: newTime
            },
            {
              attribute: "offset",
              value: newOffset
            }
          ]
        };
      } else {
        DRAG_DATA.attrUpdater = null;
      }

      instanceStartVisualizer.current.width = newWidth / pxToSeconds;
    }
  };

  const didStopDraggingInstanceStart = function() {
    instanceStartVisualizer.current.width = 0;
    if (DRAG_DATA && DRAG_DATA.attrUpdater) {
      onUpdate(DRAG_DATA.attrUpdater);
      DRAG_DATA = null;
    }
  };

  return (
    <Container
      x={midiPartInstanceAST.startsAt / pxToSeconds}
      y={0}
      interactive
      cursor="pointer"
      click={() => console.log("clicked instance")}
    >
      <Rectangle
        x={0}
        y={0}
        width={instanceWidthPx}
        height={HEADER_HEIGHT}
        fill={Colors.light}
      />

      <Rectangle
        x={0}
        y={HEADER_HEIGHT}
        width={instanceWidthPx}
        height={NOTE_CONTAINER_HEIGHT}
        fill={Colors.mid}
        alpha={0.3}
      >
        <Container y={noteContainerYpx}>{partNotes}</Container>
      </Rectangle>

      {loopStartIndicators}

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
    </Container>
  );
};

export default React.memo(({ midiTrackAST }: Props) => {
  const dispatch = useDispatch();
  const measureWidthSeconds = useSelector(measureWidthSecondsSelector);
  const pxToSeconds = useSelector(pxToSecondsSelector);

  const handleUpdate = (attrUpdater: ProjectAttributeUpdater) => {
    dispatch(updateProjectAttribute(attrUpdater));
  };

  const partElements: JSX.Element[] = midiTrackAST.midiParts.reduce(
    (acc: JSX.Element[], midiPartAST: MIDIPartAST) => {
      console.log(`~~> render <MIDITrack id={${midiTrackAST.id}} />`);

      // Loop through and find the best note height for the part by checking
      // the rangeClicks can fit in the given height. In the case of a 0.5
      // height, just let it overflow.

      // TODO: Clipping mask the NOTE_CONTAINER for rare case when rangeClicks is over 240
      const [min, max] = midiPartAST.valueRange;
      const rangeClicks = max - min;
      const noteHeight = largestNoteHeightForRangeClicks(rangeClicks);

      // Vertically center notes in the note container
      const totalHeightOfNotes = rangeClicks * noteHeight;
      const noteContainerYpx =
        totalHeightOfNotes < NOTE_CONTAINER_HEIGHT
          ? (NOTE_CONTAINER_HEIGHT - totalHeightOfNotes) / 2
          : 0;

      const instances = midiPartAST.midiPartInstances.map(
        (midiPartInstanceAST: MIDIPartInstanceAST) => {
          return (
            <MIDIPartInstance
              key={midiPartInstanceAST.id}
              midiPartAST={midiPartAST}
              midiPartInstanceAST={midiPartInstanceAST}
              measureWidthSeconds={measureWidthSeconds}
              noteContainerYpx={noteContainerYpx}
              noteHeight={noteHeight}
              pxToSeconds={pxToSeconds}
              onUpdate={handleUpdate}
            />
          );
        }
      );

      return [...acc, ...instances];
    },
    []
  );

  return <>{partElements}</>;
});
