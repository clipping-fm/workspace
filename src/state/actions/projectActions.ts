import { Dispatch } from 'redux';
import { ProjectState } from 'state/reducers/project';
import Project, { ProjectAST } from 'lib/Project';

export const loadProject = (project: ProjectState) => {
  return (dispatch: Dispatch) => {
    const projectAST: ProjectAST = Project.loadProject(project);

    return dispatch({
      type: 'LOAD_PROJECT',
      payload: { 
        project,
        projectAST
      } 
    });
  }
};

type ProjectAttributeKeyValuePair = {
  attribute: string,
  value: string | number
};

export type ProjectAttributeUpdater = {
  id: string,
  type: string,
  keyValuePairs: ProjectAttributeKeyValuePair[]
};

// TODO: Better typings
export const updateProjectAttribute = (attrUpdater: ProjectAttributeUpdater) => {
  return (dispatch: Dispatch, getState: Function) => {
    const { id, type, keyValuePairs } = attrUpdater;

    // Ensure this entity exists
    const currentProject = getState().project;
    const existingEntity = currentProject[type][id];
    if (!existingEntity) return;

    // Ensure it actually needs changes
    const noChangesRequired = keyValuePairs.every(kvp => {
      return existingEntity[kvp.attribute] === kvp.value;
    });
    if (noChangesRequired) return;

    // Make the changes
    const newProjectRevision = { ...currentProject };
    newProjectRevision[type][id] = { ...existingEntity };
    keyValuePairs.forEach(kvp => {
      newProjectRevision[type][id][kvp.attribute] = kvp.value;
    });

    // Tell everyone
    const project: ProjectState = Project.enforceIntegrity(newProjectRevision);
    const projectAST: ProjectAST = Project.loadProject(project);

    return dispatch({
      type: 'UPDATE_PROJECT_ATTRIBUTE',
      payload: { 
        project,
        projectAST
      } 
    });
  }
};
