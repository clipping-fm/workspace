export default {
  midiNotes: {
    '78a08435-4bc0-4047-a13e-878f0be16fc7': {
      id: '78a08435-4bc0-4047-a13e-878f0be16fc7',
      midiPartId: 'e75570b0-6caf-4a44-ac7b-bd4fa87a6a57',
      duration: 1.125,
      midi: 55,
      name: 'G3',
      time: 0,
      velocity: 0.1889763779527559,
    },
    'cd2eaa68-702a-4493-bac2-c1a38c53cb94': {
      id: 'cd2eaa68-702a-4493-bac2-c1a38c53cb94',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      duration: '4n',
      midi: 55,
      name: 'G3',
      time: 0,
      velocity: 0.1889763779527559,
    },
    '8f1c3fac-cb56-456d-988b-88d8d44c796c': {
      id: '8f1c3fac-cb56-456d-988b-88d8d44c796c',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      duration: '4n',
      midi: 67,
      name: 'G4',
      time: '1m',
      velocity: 0.1889763779527559,
    },
    '496a2d78-f525-4ddb-a0b4-34e15c981c8f': {
      id: '496a2d78-f525-4ddb-a0b4-34e15c981c8f',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      duration: '2n',
      midi: 48,
      name: 'C3',
      time: '3m',
      velocity: 0.1889763779527559,
    },
    'de564275-4a54-4997-b635-c27a815470e8': {
      id: 'de564275-4a54-4997-b635-c27a815470e8',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      duration: '2n',
      midi: 67,
      name: 'G4',
      time: '1:3',
      velocity: 0.1889763779527559,
    },
  },

  midiPartInstances: {
    '81b94208-2081-4c6c-a325-9dc96a91e3e9': {
      id: '81b94208-2081-4c6c-a325-9dc96a91e3e9',
      midiPartId: 'e75570b0-6caf-4a44-ac7b-bd4fa87a6a57',
      time: 0.3,
      offset: 0,
      duration: 0.5,
    },
    '81b94208-2081-4c6c-a325-9dc96a91e3e8': {
      id: '81b94208-2081-4c6c-a325-9dc96a91e3e8',
      midiPartId: 'e75570b0-6caf-4a44-ac7b-bd4fa87a6a57',
      time: 1.2,
      offset: 0,
      duration: 0.5,
    },
    '81af2b43-6a1a-4b10-8261-3b6cde669bdc': {
      id: '81af2b43-6a1a-4b10-8261-3b6cde669bdc',
      midiPartId: 'e75570b0-6caf-4a44-ac7b-bd4fa87a6a57',
      time: 13,
      offset: 0,
      duration: 1.125,
    },
    '7a2abcd7-e0e2-4b30-9e8a-9bfb6b0a0a55': {
      id: '7a2abcd7-e0e2-4b30-9e8a-9bfb6b0a0a55',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      time: '0m',
      offset: 0,
      duration: '6m',
    },
    '5ddaff9b-4051-49d1-92c7-48dc3f8fe8a5': {
      id: '5ddaff9b-4051-49d1-92c7-48dc3f8fe8a5',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      time: '13m',
      offset: '2m',
      duration: '5m',
    },
    '6fdaff9b-4051-49d1-92c7-48dc3f8fe8a6': {
      id: '6fdaff9b-4051-49d1-92c7-48dc3f8fe8a6',
      midiPartId: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      time: '13m',
      offset: '2m',
      duration: '1m',
    },
  },

  midiParts: {
    'e75570b0-6caf-4a44-ac7b-bd4fa87a6a57': {
      id: 'e75570b0-6caf-4a44-ac7b-bd4fa87a6a57',
      trackId: 'f1414a7e-e554-413d-b918-72afa85daf12',
      name: 'Intro',
      duration: 0.5,
      midiPartInstanceIds: [
        '81b94208-2081-4c6c-a325-9dc96a91e3e9',
        '81b94208-2081-4c6c-a325-9dc96a91e3e8',
        '81af2b43-6a1a-4b10-8261-3b6cde669bdc',
      ],
      midiNoteIds: ['78a08435-4bc0-4047-a13e-878f0be16fc7'],
    },
    'eede59d1-dd72-4d01-84b6-528e11e2f7f5': {
      id: 'eede59d1-dd72-4d01-84b6-528e11e2f7f5',
      trackId: 'bc3916f0-df2a-499e-b2f5-e4f3d0b8009b',
      name: 'Intro',
      duration: '4m',
      midiPartInstanceIds: [
        //'7a2abcd7-e0e2-4b30-9e8a-9bfb6b0a0a55',
        '5ddaff9b-4051-49d1-92c7-48dc3f8fe8a5',
        //'6fdaff9b-4051-49d1-92c7-48dc3f8fe8a6'
      ],
      midiNoteIds: [
        'cd2eaa68-702a-4493-bac2-c1a38c53cb94',
        '8f1c3fac-cb56-456d-988b-88d8d44c796c',
        '496a2d78-f525-4ddb-a0b4-34e15c981c8f',
        'de564275-4a54-4997-b635-c27a815470e8',
      ],
    },
  },

  tracks: {
    'f1414a7e-e554-413d-b918-72afa85daf12': {
      id: 'f1414a7e-e554-413d-b918-72afa85daf12',
      index: 0,
      name: 'Bass Line',
      type: 'midi',
      midiPartIds: ['e75570b0-6caf-4a44-ac7b-bd4fa87a6a57'],
    },
    'bc3916f0-df2a-499e-b2f5-e4f3d0b8009b': {
      id: 'bc3916f0-df2a-499e-b2f5-e4f3d0b8009b',
      index: 1,
      name: 'Melody',
      type: 'midi',
      midiPartIds: ['eede59d1-dd72-4d01-84b6-528e11e2f7f5'],
    },
  },
};
