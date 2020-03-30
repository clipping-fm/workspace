import { Action } from 'state/actions/types';

export interface TransportState {
  bpm: number;
}

const initialState: TransportState = {
  bpm: 120,
};

export default (
  state: TransportState = initialState,
  action: Action
): TransportState => {
  switch (action.type) {
    default:
      return state;
  }
};
