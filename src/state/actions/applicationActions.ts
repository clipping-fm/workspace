import { Dispatch } from 'redux';
import { loadProject } from 'state/actions/projectActions';
import dummyProject from 'mocks/projects/dummy';

export const initializeApplication = () => {
  return (dispatch: Dispatch) => {
    return dispatch({
      type: 'INITIALIZE_APPLICATION',
      payload: new Promise((resolve) => {
        loadProject(dummyProject)(dispatch);
        resolve();
      })
    });
  }
}
