import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import Colors from 'constants/Colors';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import { GlobalState, MIDIPartInstance, MIDIPart, MIDITrack } from 'types';
import { 
  projectEndsAtSecondsSelector, 
  viewportWidthSecondsSelector 
} from 'state/selectors/workspaceLayoutAttrs'; 
import Transport from 'lib/Transport';

type Props = {
  heightPx: number,
  widthPx: number
};

const POSSIBLE_TRACK_HEIGHTS = [4, 3, 2, 1, 0.5];
function largestTrackHeightForTrackCount(containerHeight: number, trackCount: number): number {
  return POSSIBLE_TRACK_HEIGHTS.reduce((acc, noteHeight) => {
    if (containerHeight/acc >= trackCount) return acc;
    return noteHeight;
  }, POSSIBLE_TRACK_HEIGHTS[0]);
};

const MiniTracks = ({
  heightPx,
  widthPx
}: Props) => {
  const tracks: MIDITrack[] = useSelector((state: GlobalState) => Object.values(state.project.tracks));
  const midiParts: { [id: string]: MIDIPart } = useSelector((state: GlobalState) => state.project.midiParts);
  const midiPartInstances: { [id: string]: MIDIPartInstance } = useSelector((state: GlobalState) => state.project.midiPartInstances);

  const trackHeight: number = largestTrackHeightForTrackCount(heightPx, tracks.length);

  const projectEndsAtSeconds: number = useSelector(projectEndsAtSecondsSelector);
  const viewportWidthSeconds: number = useSelector(viewportWidthSecondsSelector);
  const maxWidthSeconds: number = Math.max(viewportWidthSeconds, projectEndsAtSeconds);

  return (
    <>
      {tracks.map((track: MIDITrack) => {
        const trackMIDIParts: MIDIPart[] = track.midiPartIds.map((id: string) => midiParts[id]);
        const trackMIDIPartInstances: MIDIPartInstance[] = trackMIDIParts.reduce((acc: MIDIPartInstance[], trackMIDIPart: MIDIPart) => {
          return [
            ...acc, 
            ...trackMIDIPart.midiPartInstanceIds.map((id: string) => midiPartInstances[id])
          ];
        }, []);

        return (
          <Container key={track.id} x={0} y={trackHeight * track.index}>
            {trackMIDIPartInstances.map((trackMIDIPartInstance: MIDIPartInstance) => {
              return (
                <Rectangle
                  key={trackMIDIPartInstance.id}
                  x={(Transport.toSeconds(trackMIDIPartInstance.time) / maxWidthSeconds) * widthPx}
                  y={0}
                  width={(Transport.toSeconds(trackMIDIPartInstance.duration) / maxWidthSeconds) * widthPx}
                  height={trackHeight}
                  fill={Colors.light}
                />
              );
            })}
          </Container>
        );
      })}
    </>
  );
};

export default memo(MiniTracks);
