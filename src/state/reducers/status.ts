import { Status } from 'types';
import { Action } from 'state/actions/types';

export interface StatusState {
  initializeApplication: Status;
};

const initialState: StatusState = {
  initializeApplication: Status.IDLE
};

export default (
  state: StatusState = initialState,
  action: Action
): StatusState => {
  switch (action.type) {
    case 'INITIALIZE_APPLICATION_PENDING':
      return { ...state, initializeApplication: Status.PENDING };
    case 'INITIALIZE_APPLICATION_FULFILLED':
      return { ...state, initializeApplication: Status.FULFILLED };
    case 'INITIALIZE_APPLICATION_REJECTED':
      return { ...state, initializeApplication: Status.REJECTED };

    default:
      return state;
  }
};
