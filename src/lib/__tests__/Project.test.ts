import Project from 'lib/Project';

it('noteRangeForMIDINotes', () => {
  /* Works with an empty collection */
  expect(
    noteRangeForMIDINotes([])
  ).toEqual({ 
    highest: -1, 
    lowest: -1 
  });

  /* Works with a set of notes */
  expect(
    noteRangeForMIDINotes(notes)
  ).toEqual({ 
    highest: 67, 
    lowest: 55 
  });
});

it('prepareMIDINotesForPlayback', () => {
  /* Works with an empty collection */
  expect(
    noteRangeForMIDINotes([])
  ).toEqual({ 
    midiNotesAST: [], 
    midiNotesForPlayback: [] 
  });

  /* TODO: Works with a set of notes */
  expect(
    noteRangeForMIDINotes(notes)
  ).toEqual({ 
    midiNotesAST: [], 
    midiNotesForPlayback: [] 
  });
});

it('loadOrUpdateMIDIPartInstance', () => {
});

it('loadOrUpdateMIDIPart', () => {
});

it('Project.loadProject', () => {
});
