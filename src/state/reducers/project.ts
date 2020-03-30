import { MIDITrack, MIDIPart, MIDIPartInstance, MIDINote } from 'types';
import { Action } from 'state/actions/types';

export interface ProjectState {
  tracks: {
    [id: string]: MIDITrack;
  };
  midiParts: {
    [id: string]: MIDIPart;
  };
  midiPartInstances: {
    [id: string]: MIDIPartInstance;
  };
  midiNotes: {
    [id: string]: MIDINote;
  };
}

const initialState: ProjectState = {
  tracks: {},
  midiParts: {},
  midiPartInstances: {},
  midiNotes: {},
};

export default (
  state: ProjectState = initialState,
  action: Action
): ProjectState => {
  switch (action.type) {
    case 'LOAD_PROJECT':
    case 'UPDATE_PROJECT_ATTRIBUTE':
      return action.payload.project;
    default:
      return state;
  }
};
