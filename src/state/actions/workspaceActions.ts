import { Dispatch } from 'redux';
import { Layout } from 'types';

export const setWorkspaceLayout = (workspaceLayout: Layout) => {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: 'SET_WORKSPACE_LAYOUT',
      payload: workspaceLayout
    });
  }
}

export const setViewportLeftPosition = (position: number) => {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: 'SET_VIEWPORT_LEFT_POSITION',
      payload: position 
    });
  }
}
