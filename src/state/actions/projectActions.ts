import { Dispatch } from 'redux';
import { ProjectState } from 'state/reducers/project';
import Project from 'lib/Project';
import { GlobalState, MIDIPartInstance, MIDIPart } from 'types';
import uuid from 'utils/makeUUID';
import { measureWidthSecondsSelector } from 'state/selectors/workspaceLayoutAttrs';
import Transport from 'lib/Transport';

export const loadProject = (project: ProjectState) => {
  return (dispatch: Dispatch) => {
    Project.loadProject(project);
    return dispatch({
      type: 'LOAD_PROJECT',
      payload: { project },
    });
  };
};

type ProjectAttributeKeyValuePair = {
  attribute: string;
  value: string | number;
};

export type ProjectAttributeUpdater = {
  id: string;
  type: string;
  keyValuePairs: ProjectAttributeKeyValuePair[];
};

// TODO: Better typings
export const updateProjectAttribute = (
  attrUpdater: ProjectAttributeUpdater
) => {
  return (dispatch: Dispatch, getState: Function) => {
    const { id, type, keyValuePairs } = attrUpdater;

    // Ensure this entity exists
    const currentProject = getState().project;
    const existingEntity = currentProject[type][id];
    if (!existingEntity) return;

    // Ensure it actually needs changes
    const noChangesRequired = keyValuePairs.every((kvp) => {
      return existingEntity[kvp.attribute] === kvp.value;
    });
    if (noChangesRequired) return;

    // Make the changes
    const newProjectRevision = { ...currentProject };
    newProjectRevision[type][id] = { ...existingEntity };
    keyValuePairs.forEach((kvp) => {
      newProjectRevision[type][id][kvp.attribute] = kvp.value;
    });

    // Tell everyone
    const project: ProjectState = Project.enforceIntegrity(newProjectRevision);
    Project.loadProject(project);

    return dispatch({
      type: 'UPDATE_PROJECT_ATTRIBUTE',
      payload: { project },
    });
  };
};

export const createMIDIPartInstance = (
  startsAtSeconds: number,
  trackId: string
) => {
  return (dispatch: Dispatch, getState: Function) => {
    const state: GlobalState = getState();

    // Find the ideal window for a clean full measure
    const measureWidthSeconds: number = measureWidthSecondsSelector(state);
    const closestBarStartsAtSeconds: number =
      Math.floor(startsAtSeconds / measureWidthSeconds) * measureWidthSeconds;
    const closestBarEndsAtSeconds: number =
      closestBarStartsAtSeconds + measureWidthSeconds;

    // Check if there's instances that collide with that ideal window
    const { tracks, midiParts, midiPartInstances } = state.project;
    const track = tracks[trackId];
    const trackMIDIParts: MIDIPart[] = track.midiPartIds.map(
      (id: string) => midiParts[id]
    );
    const trackMIDIPartInstances: MIDIPartInstance[] = trackMIDIParts.reduce(
      (acc: MIDIPartInstance[], trackMIDIPart: MIDIPart) => {
        return [
          ...acc,
          ...trackMIDIPart.midiPartInstanceIds.map(
            (id: string) => midiPartInstances[id]
          ),
        ];
      },
      []
    );

    const window: [number, number] = trackMIDIPartInstances.reduce(
      (acc, trackMIDIPartInstance: MIDIPartInstance) => {
        const instanceStartTimeSeconds = Transport.toSeconds(
          trackMIDIPartInstance.time
        );
        const instanceEndTimeSeconds =
          instanceStartTimeSeconds +
          Transport.toSeconds(trackMIDIPartInstance.duration);
        if (instanceStartTimeSeconds >= acc[1]) return acc;
        if (instanceEndTimeSeconds <= acc[0]) return acc;
        if (instanceStartTimeSeconds > startsAtSeconds)
          acc[1] = instanceStartTimeSeconds;
        if (instanceEndTimeSeconds < startsAtSeconds)
          acc[0] = instanceEndTimeSeconds;
        return acc;
      },
      [closestBarStartsAtSeconds, closestBarEndsAtSeconds]
    );

    const duration = Transport.toBarsBeatsSixteenths(window[1] - window[0]);

    const newMIDIPart: MIDIPart = {
      id: uuid(),
      trackId,
      name: 'Untitled',
      duration,
      midiPartInstanceIds: [],
      midiNoteIds: [],
    };
    const newMIDIPartInstance: MIDIPartInstance = {
      id: uuid(),
      midiPartId: newMIDIPart.id,
      time: Transport.toBarsBeatsSixteenths(window[0]),
      offset: 0,
      duration,
    };
    newMIDIPart.midiPartInstanceIds = [newMIDIPartInstance.id];
    const newTrack = {
      ...track,
      midiPartIds: [...track.midiPartIds, newMIDIPart.id],
    };

    const newProjectRevision = { ...state.project };
    newProjectRevision.midiParts[newMIDIPart.id] = newMIDIPart;
    newProjectRevision.midiPartInstances[
      newMIDIPartInstance.id
    ] = newMIDIPartInstance;
    newProjectRevision.tracks[track.id] = newTrack;

    // Tell everyone
    const project: ProjectState = Project.enforceIntegrity(newProjectRevision);
    Project.loadProject(project);

    return dispatch({
      type: 'UPDATE_PROJECT_ATTRIBUTE',
      payload: { project },
    });
  };
};
