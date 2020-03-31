import { WorkspaceState } from 'state/reducers/workspace';
import { StatusState } from 'state/reducers/status';
import { ProjectState } from 'state/reducers/project';
import { TransportState } from 'state/reducers/transport';

export type LoopedMIDINote = {
  loopIndex: number;
  relativeTime: number;
  clampedDuration: number;
  midiNote: MIDINote;
};

/* The Project Data */
export type MIDINote = {
  id: string;
  midiPartId: string;
  midi: number;
  name: string;
  velocity: number;
  duration: number | string;
  time: number | string;
};

export type MIDIPartInstance = {
  id: string;
  midiPartId: string;
  time: number | string;
  offset: number | string;
  duration: number | string;
};

export type MIDIPart = {
  id: string;
  trackId: string;
  name: string;
  duration: number | string;
  midiPartInstanceIds: string[];
  midiNoteIds: string[];
};

export type TrackPart = MIDIPart;

export type MIDITrack = {
  id: string;
  index: number;
  name: string;
  type: string;
  midiPartIds: string[];
};

export type Track = MIDITrack;

/* Misc */
export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Status {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
}

export interface GlobalState {
  workspace: WorkspaceState;
  status: StatusState;
  project: ProjectState;
  transport: TransportState;
}
