import normalizeTime from 'utils/normalizeTime';
import { MIDINote, LoopedMIDINote } from 'types';

const makeLoopedMIDINotes = (
  midiNotes: MIDINote[],
  midiPartInstanceDuration: number,
  midiPartDuration: number,
  midiPartInstanceOffset: number,
): LoopedMIDINote[] => {
  return Array.from(
    Array(Math.ceil(midiPartInstanceDuration / midiPartDuration)).keys()
  ).reduce((acc: LoopedMIDINote[], i: number) => {
    const loopedMIDINoteSet: LoopedMIDINote[] =
      midiNotes.map((midiNote: MIDINote) => {
        const relativeTime = 
          normalizeTime(midiNote.time) - midiPartInstanceOffset + (i * midiPartDuration);
        let clampedDuration = normalizeTime(midiNote.duration);
        const relativeEndTime = relativeTime + clampedDuration;

        /* Ensure the final note doesn't exceed the clip's duration */
        if (relativeEndTime > midiPartDuration) {
          clampedDuration = (clampedDuration - (relativeEndTime - midiPartDuration)); 
        }

        return {
          loopIndex: i,
          relativeTime,
          clampedDuration,
          midiNote
        };
      }).filter(loopedMIDINote => {
        return loopedMIDINote.relativeTime >= 0 && loopedMIDINote.relativeTime < midiPartDuration;
      });

    return [...acc, ...loopedMIDINoteSet];
  }, []);
};

export default makeLoopedMIDINotes;
