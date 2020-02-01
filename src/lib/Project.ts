import normalizeTime from 'utils/normalizeTime';
import times from 'utils/times';
//import AudioContext from 'lib/AudioContext';
import { MIDINote, MIDIPartInstance, MIDIPart, MIDITrack } from 'types';
import { ProjectState } from 'state/reducers/project';

// Integrity: MIDIPartInstance Offset can't be longer than the MIDIPartDuration 
// Integrity: MIDIPartInstance should not overlap

/* The ProjectAST is used mostly for drawing the workspace */
export type ProjectAST = {
  tracks: MIDITrackAST[]
};

export type MIDITrackAST = {
  id: string,
  index: number,
  midiParts: MIDIPartAST[]
};

export type MIDIPartAST = {
  id: string,
  valueRange: [number, number],
  midiPartInstances: MIDIPartInstanceAST[]
};

export type MIDIPartInstanceAST = {
  id: string,
  startsAt: number,
  duration: number,
  offset: number,
  partDuration: number,
  loopStartPositions: number[],
  midiNotes: MIDINoteAST[]
};

export type MIDINoteAST = {
  id: string,
  startsAt: number,
  duration: number,
  value: number
};

/* Private ProjectAST Builders */
export function noteRangeForMIDINotes(
  midiNotes: MIDINote[]
): { highest: number, lowest: number } {
  return midiNotes.reduce((acc, n) => {
    if (acc.highest === -1 && acc.lowest === -1) {
      return { highest: n.midi, lowest: n.midi };
    };
    const newAcc = { ...acc };
    if (n.midi > acc.highest) newAcc.highest = n.midi;
    if (n.midi < acc.lowest) newAcc.lowest = n.midi;
    return newAcc;
  }, { highest: -1, lowest: -1});
};

// Note: All timing values for notes are relative to their instance
export function prepareMIDINotesForPlayback(
  midiNotes: MIDINote[],
  currentPassIndex: number,
  instanceDurationSeconds: number,
  partDurationSeconds: number,
  offsetDurationSeconds: number
): { midiNotesAST: MIDINoteAST[], midiNotesForPlayback: MIDINote[] } {

  return midiNotes.reduce((
    acc: {
      midiNotesAST: MIDINoteAST[],
      midiNotesForPlayback: MIDINote[] 
    }, 
    midiNote: MIDINote
  ) => {
    const startsAtSeconds: number = 
      normalizeTime(midiNote.time) - offsetDurationSeconds + (currentPassIndex * partDurationSeconds);
    const durationSeconds: number = normalizeTime(midiNote.duration);
    const endsAtSeconds = startsAtSeconds + durationSeconds;

    /* If the note starts after the instance ends, don't include it */
    if (startsAtSeconds >= instanceDurationSeconds) return acc;
    /* If the note ends before the instance does, don't include it */
    if (endsAtSeconds < 0) return acc;

    /* The midiNoteAST includes notes that start before the instance */
    const midiNoteAST: MIDINoteAST = {
      id: `${currentPassIndex}-${midiNote.id}`,
      startsAt: startsAtSeconds,
      duration: durationSeconds,
      value: midiNote.midi
    };

    const midiNoteForPlayback: MIDINote = { ...midiNote };

    /* If the note ends after the instance ends, trim it */
    if (endsAtSeconds > instanceDurationSeconds) {
      // Note: This type of note should not play it's full
      // duration, feed a trimmed version to Tone.js
      midiNoteAST.duration = midiNoteForPlayback.duration = instanceDurationSeconds - startsAtSeconds;
    };

    if (startsAtSeconds < 0) {
      // Note: This type of note should not play,
      // as it has no attack, no need to send to Playback
      midiNoteAST.startsAt = 0;
      midiNoteAST.duration = midiNoteAST.duration + startsAtSeconds;
      return {
        ...acc,
        midiNotesAST: [...acc.midiNotesAST, midiNoteAST]
      }
    };

    return {
      midiNotesAST: [...acc.midiNotesAST, midiNoteAST],
      midiNotesForPlayback: [...acc.midiNotesForPlayback, midiNoteForPlayback]
    };
  }, { midiNotesAST: [], midiNotesForPlayback: [] });
};

export function loadOrUpdateMIDIPartInstance(
  midiPartInstance: MIDIPartInstance, 
  midiNotes: MIDINote[],
  partDurationInSeconds: number
): MIDIPartInstanceAST {
  // TODO: ensure integrity of project data
  
  /* Normalize times to seconds */
  const instanceDurationInSeconds: number = normalizeTime(midiPartInstance.duration);
  const offsetDurationInSeconds: number = normalizeTime(midiPartInstance.offset);
  const instanceStartsAtSeconds: number = normalizeTime(midiPartInstance.time);
  const instanceEndsAtSeconds: number = instanceStartsAtSeconds + instanceDurationInSeconds;

  const midiPartInstanceAST: MIDIPartInstanceAST = {
    id: midiPartInstance.id,
    startsAt: instanceStartsAtSeconds,
    duration: instanceDurationInSeconds,
    offset: offsetDurationInSeconds,
    partDuration: partDurationInSeconds,
    loopStartPositions: [], // relative to startsAt
    midiNotes: [] // relative to startsAt
  };

  const requiredPasses: number =
    Math.ceil(instanceDurationInSeconds/partDurationInSeconds);

  times(requiredPasses, (i: number) => {
    // Seconds
    //let startsAt: number;
    let offset: number;
    let relativeLoopStartPosition;

    if (i === 0) {
      //startsAt = instanceStartsAtSeconds;
      offset = offsetDurationInSeconds;

      // TODO: only add this if the upcoming stop isn't after it
      if (offset === 0) {
        relativeLoopStartPosition = 0;
      } else {
        relativeLoopStartPosition = partDurationInSeconds - offsetDurationInSeconds;
      }
    } else {
      //startsAt = (
      //  instanceStartsAtSeconds +
      //  (partDurationInSeconds - offsetDurationInSeconds) +
      //  ((i - 1) * partDurationInSeconds)
      //);
      offset = 0;

      relativeLoopStartPosition = (
        midiPartInstanceAST.loopStartPositions[0] + 
        (i * partDurationInSeconds)
      );
    }

    /* Only add a loopStartPosition for this loop if it's not affter the end of the instance */
    if (
      (instanceStartsAtSeconds + relativeLoopStartPosition) < instanceEndsAtSeconds
    ) {
      midiPartInstanceAST.loopStartPositions = [
        ...midiPartInstanceAST.loopStartPositions,
        relativeLoopStartPosition
      ];
    }

    /* Prepare midiNotes for AST and Playback */
    const { midiNotesAST, /*midiNotesForPlayback*/ }: { midiNotesAST: MIDINoteAST[], /*midiNotesForPlayback: MIDINote[]*/ } =
      prepareMIDINotesForPlayback(
        midiNotes, 
        i, 
        instanceDurationInSeconds,
        partDurationInSeconds,
        offsetDurationInSeconds
      );

    midiPartInstanceAST.midiNotes = [
      ...midiPartInstanceAST.midiNotes,
      ...midiNotesAST
    ];

    //AudioContext.loadMIDIPart(
    //  midiPartInstance.id, 
    //  midiNotesForPlayback, 
    //  startsAt, 
    //  endAt, 
    //  offset
    //);
  });

  return midiPartInstanceAST;
};

export function loadOrUpdateMIDIPart(
  project: ProjectState, 
  midiPartId: string
): MIDIPartAST {
  /* Find all relationships */
  const midiPart: MIDIPart = project.midiParts[midiPartId];
  const midiNotes: MIDINote[] = midiPart.midiNoteIds.map(id => project.midiNotes[id]);
  const midiPartInstances: MIDIPartInstance[] = midiPart.midiPartInstanceIds.map(id => project.midiPartInstances[id]);

  /* Normalize times to seconds */
  const partDurationInSeconds: number 
    = normalizeTime(midiPart.duration);

  /* Find the note range for this part */
  const noteRange: { highest: number, lowest: number } 
    = noteRangeForMIDINotes(midiNotes); 

  /* Init the AST */
  const midiPartAST: MIDIPartAST = {
    id: midiPartId,
    valueRange: [noteRange.lowest, noteRange.highest],
    midiPartInstances: midiPartInstances.map(midiPartInstance => {
      return loadOrUpdateMIDIPartInstance(
        midiPartInstance,
        midiNotes,
        partDurationInSeconds
      );
    })
  };

  return midiPartAST;
};

export function loadOrUpdateMIDITrack(
  project: ProjectState,
  track: MIDITrack
): MIDITrackAST {
  const midiParts: MIDIPartAST[] = track.midiPartIds.map((midiPartId: string) => {
    return loadOrUpdateMIDIPart(project, midiPartId);
  });

  return { id: track.id, index: track.index, midiParts };
};

/* Public Methods */
export default {
  loadProject(project: ProjectState): ProjectAST {
    // TODO: sort by index
    const tracks: MIDITrackAST[] = Object.values(project.tracks).map((
      midiTrack: MIDITrack
    ) => {
      return loadOrUpdateMIDITrack(project, midiTrack);
    });

    return { tracks };
  },

  enforceIntegrity(project: ProjectState): ProjectState {
    return project;
  }
};
