import { ProjectState } from 'state/reducers/project';
import { ProjectAST } from 'lib/Project';
import { Layout } from 'types';

interface InitializeApplicationPendingAction {
  type: 'INITIALIZE_APPLICATION_PENDING';
}

interface InitializeApplicationRejectedAction {
  type: 'INITIALIZE_APPLICATION_REJECTED';
  payload: Error;
}

interface InitializeApplicationFulfilledAction {
  type: 'INITIALIZE_APPLICATION_FULFILLED';
}

export type InitializeApplicationAction =
  | InitializeApplicationPendingAction
  | InitializeApplicationRejectedAction
  | InitializeApplicationFulfilledAction;

interface LoadProjectAction {
  type: 'LOAD_PROJECT';
  payload: {
    project: ProjectState,
    projectAST: ProjectAST
  }
}

interface UpdateProjectAttributeAction {
  type: 'UPDATE_PROJECT_ATTRIBUTE';
  payload: {
    project: ProjectState,
    projectAST: ProjectAST
  }
};

interface SetWorkspaceLayoutAction {
  type: 'SET_WORKSPACE_LAYOUT';
  payload: Layout
};

interface SetViewportLeftPositionAction {
  type: 'SET_VIEWPORT_LEFT_POSITION';
  payload: number 
};

export type Action =
  | InitializeApplicationAction
  | UpdateProjectAttributeAction
  | LoadProjectAction
  | SetWorkspaceLayoutAction
  | SetViewportLeftPositionAction; 
