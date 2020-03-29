//import AudioContext from 'lib/AudioContext';
import { ProjectState } from 'state/reducers/project';

const Project = {
  loadProject(project: ProjectState): ProjectState {
    return Project.enforceIntegrity(project);
  },

  // Integrity: MIDIPartInstance Offset can't be longer than the MIDIPartDuration 
  // Integrity: MIDIPartInstance should not overlap
  // Integrity: Ensure all times are in bars:beats:sixteenths 
  enforceIntegrity(project: ProjectState): ProjectState {
    return project;
  }
};

export default Project;
