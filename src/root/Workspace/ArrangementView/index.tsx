import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-pixi-fiber';

import MIDITrackComponent from './MIDITrack';
import GridLines from './GridLines';
import ProgressBar from './ProgressBar';
import Rectangle from 'shapes/Rectangle';

import System from 'constants/System';
import Colors from 'constants/Colors';

import {
  measureWidthPxSelector,
  projectEndsAtPxSelector,
  pxToSecondsSelector,
} from 'state/selectors/workspaceLayoutAttrs';
import { createMIDIPartInstance } from 'state/actions/projectActions';
import { GlobalState, MIDITrack, Layout } from 'types';

type Props = {
  layout: Layout;
};

const ArrangementView = ({ layout }: Props) => {
  const dispatch = useDispatch();
  const midiTracks: MIDITrack[] = useSelector((state: GlobalState) =>
    Object.values(state.project.tracks)
  );

  const measureWidthPx: number = useSelector(measureWidthPxSelector);
  const projectEndsAtPx: number = useSelector(projectEndsAtPxSelector);
  const pxToSeconds: number = useSelector(pxToSecondsSelector);

  const totalWidthPx = Math.max(layout.width, projectEndsAtPx);
  const totalHeightPx = Math.max(
    layout.height,
    midiTracks.length * System.ui.trackHeight
  );

  console.log('render <ArrangementView />');
  return (
    <>
      <GridLines
        height={totalHeightPx}
        projectWidthPx={totalWidthPx}
        measureWidthPx={measureWidthPx}
      />

      {midiTracks.map((midiTrack: MIDITrack) => {
        return (
          <Container
            key={midiTrack.id}
            x={0}
            y={System.ui.trackHeight * midiTrack.index}
          >
            <Rectangle
              x={0}
              y={0}
              width={totalWidthPx}
              height={System.ui.trackHeight}
              fill={Colors.mid}
              alpha={0.1}
              border={{ width: 1, color: Colors.mid }}
              click={function (
                this: PIXI.Graphics,
                event: PIXI.interaction.InteractionEvent
              ) {
                const clickPositionSeconds =
                  event.data.getLocalPosition(this).x * pxToSeconds;
                dispatch(
                  createMIDIPartInstance(clickPositionSeconds, midiTrack.id)
                );
              }}
            />
            <MIDITrackComponent midiTrackId={midiTrack.id} />
          </Container>
        );
      })}

      <ProgressBar height={totalHeightPx} />
    </>
  );
};

export default memo(ArrangementView);
