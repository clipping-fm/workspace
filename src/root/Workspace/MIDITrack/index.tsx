import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';
import System from 'constants/System';
import DraggableContainer from 'components/DraggableContainer';
import Transport from 'lib/Transport';
import { updateProjectAttribute, ProjectAttributeUpdater } from 'state/actions/projectActions';

import { Layout } from 'types';
import { MIDITrackAST, MIDIPartAST, MIDIPartInstanceAST, MIDINoteAST } from 'lib/Project';
import workspaceLayoutAttrsSelector from 'state/selectors/workspaceLayoutAttrs'; 

type Props = {
  midiTrackAST: MIDITrackAST,
  workspaceLayout: Layout
};

const HEADER_HEIGHT = 20;
const NOTE_CONTAINER_HEIGHT = System.ui.trackHeight - HEADER_HEIGHT;
const POSSIBLE_NOTE_HEIGHTS = [4, 3, 2, 1, 0.5];

function largestNoteHeightForRangeClicks(rangeClicks: number): number {
  return POSSIBLE_NOTE_HEIGHTS.reduce((acc, noteHeight) => {
    if (NOTE_CONTAINER_HEIGHT/acc >= rangeClicks) return acc;
    return noteHeight;
  }, POSSIBLE_NOTE_HEIGHTS[0]);
};

export default React.memo(({ midiTrackAST, workspaceLayout }: Props): JSX.Element => {
  const dispatch = useDispatch();

  const { measureWidthSeconds, pxToSeconds } = useSelector(workspaceLayoutAttrsSelector);

  const partElements: JSX.Element[] = midiTrackAST.midiParts.reduce((
    acc: JSX.Element[], midiPartAST: MIDIPartAST
  ) => {
    console.log(` render <MIDITrack id={${midiTrackAST.id}} />`);

    // Loop through and find the best note height for the part by checking
    // the rangeClicks can fit in the given height. In the case of a 0.5
    // height, just let it overflow. 
    
    // TODO: Clipping mask the NOTE_CONTAINER for rare case when rangeClicks is over 240
    const rangeClicks: number = (midiPartAST.valueRange[1] - midiPartAST.valueRange[0]);
    const noteHeight: number = largestNoteHeightForRangeClicks(rangeClicks);

    // Vertically center notes in the note container 
    const totalHeightOfNotes: number = rangeClicks * noteHeight;
    let noteContainerYpx: number = 0;
    if (totalHeightOfNotes < NOTE_CONTAINER_HEIGHT) {
      noteContainerYpx = (NOTE_CONTAINER_HEIGHT - totalHeightOfNotes)/2;
    }

    const instances = midiPartAST.midiPartInstances.map((midiPartInstanceAST: MIDIPartInstanceAST) => {
      const instanceWidthPx = midiPartInstanceAST.duration / pxToSeconds;

      // TODO: Make me a memo component
      let loopStartIndicators: JSX.Element[] = 
        midiPartInstanceAST.loopStartPositions.map((positionInSeconds: number) => {
          return (
            <Rectangle
              key={midiPartInstanceAST.loopStartPositions.indexOf(positionInSeconds)}
              x={positionInSeconds / pxToSeconds}
              y={0}
              width={1}
              height={System.ui.trackHeight}
              fill={Colors.highlight}
            />
          );
        });

      // TODO: Make me a memo component
      let partNotes: JSX.Element[] = midiPartInstanceAST.midiNotes.map((midiNoteAST: MIDINoteAST) => {
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
      let DRAG_DATA: null | { xOriginal: number, attrUpdater: null | ProjectAttributeUpdater };
      const didStartDraggingInstanceStart = function(event: any) {
        DRAG_DATA = { xOriginal: event.data.global.x, attrUpdater: null };
      };
      const didDragInstanceStart = function(event: any) {
        if (DRAG_DATA) {
          let newWidth = 0;

          const differenceInSeconds = ((DRAG_DATA.xOriginal - event.data.global.x) * -1) * pxToSeconds;
          const gridOffsetSeconds = midiPartInstanceAST.startsAt % measureWidthSeconds;
          const currentlyOnGrid = (gridOffsetSeconds === 0);
          //const snapToGrid = true;

          if (currentlyOnGrid) {
            if (differenceInSeconds > 0) {
              newWidth = 
                Math.ceil(differenceInSeconds / measureWidthSeconds) * measureWidthSeconds;
            } else if (differenceInSeconds < 0) {
              newWidth = 
                Math.floor(differenceInSeconds / measureWidthSeconds) * measureWidthSeconds;
            }
          } else {
            if (differenceInSeconds > 0) {
              const fill = (measureWidthSeconds - gridOffsetSeconds);
              newWidth = 
                ((Math.ceil((differenceInSeconds - fill) / measureWidthSeconds)) * measureWidthSeconds) + fill;
            } else if (differenceInSeconds < 0) {
              const fill = gridOffsetSeconds;
              newWidth = 
                ((Math.floor((differenceInSeconds - fill) / measureWidthSeconds) + 1) * measureWidthSeconds) - fill;
            }
          }

          if (newWidth) {
            const newDuration = Transport.toBarsBeatsSixteenths(midiPartInstanceAST.duration - newWidth);
            const newTime = Transport.toBarsBeatsSixteenths(midiPartInstanceAST.startsAt + newWidth);

            let newOffset = (
              ((newWidth % midiPartInstanceAST.partDuration) / midiPartInstanceAST.partDuration) * midiPartInstanceAST.partDuration
            ) + midiPartInstanceAST.offset;

            if (newOffset === midiPartInstanceAST.partDuration) {
              console.log('ho', newOffset % midiPartInstanceAST.partDuration);
              newOffset = 0; 
            } else if (newOffset > midiPartInstanceAST.partDuration) {
              console.log('he', newOffset % midiPartInstanceAST.partDuration);
            } else if (newOffset < 0) {
              console.log('hey', newOffset % midiPartInstanceAST.partDuration);
            }

            DRAG_DATA.attrUpdater = {
              id: midiPartInstanceAST.id,
              type: 'midiPartInstances',
              keyValuePairs: [{
                attribute: 'duration',
                value: newDuration
              }, {
                attribute: 'time',
                value: newTime
              }, {
                attribute: 'offset',
                value: newOffset
              }]
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
          console.log(DRAG_DATA.attrUpdater);
          dispatch(updateProjectAttribute(DRAG_DATA.attrUpdater));
          DRAG_DATA = null;
        }
      };

      return (
        <Container
          key={midiPartInstanceAST.id}
          x={midiPartInstanceAST.startsAt / pxToSeconds}
          y={System.ui.trackHeight * midiTrackAST.index}
        >
          <Rectangle
            x={0}
            y={0}
            width={instanceWidthPx} 
            height={HEADER_HEIGHT} 
            fill={Colors.light}
          >
          </Rectangle>
          <Rectangle
            x={0}
            y={HEADER_HEIGHT}
            width={instanceWidthPx} 
            height={NOTE_CONTAINER_HEIGHT} 
            fill={Colors.mid}
            alpha={0.3}
          >
            <Container y={noteContainerYpx}> 
              {partNotes}
            </Container>
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
    });

    return [...acc, ...instances];
  }, []);

  return <>{partElements}</>;
});
