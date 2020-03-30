import { Action } from 'state/actions/types';
import { Layout } from 'types';

export interface WorkspaceState {
  layout: Layout;
  viewportWidthSeconds: number;
  viewportLeftPositionSeconds: number;
}

const initialState: WorkspaceState = {
  layout: {
    x: 0,
    y: 0,
    height: 0,
    width: 1,
  },
  viewportWidthSeconds: 30,
  viewportLeftPositionSeconds: 0,
};

export default (
  state: WorkspaceState = initialState,
  action: Action
): WorkspaceState => {
  switch (action.type) {
    case 'SET_WORKSPACE_LAYOUT':
      return {
        ...state,
        layout: action.payload,
      };
    case 'SET_VIEWPORT_LEFT_POSITION':
      return {
        ...state,
        viewportLeftPositionSeconds: action.payload,
      };
    case 'LOAD_PROJECT':
    case 'UPDATE_PROJECT_ATTRIBUTE':
      return {
        ...state,
      };
    default:
      return state;
  }
};
