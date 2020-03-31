import Tone from 'tone';

const Cache = {
  midiPartInstances: {},
};

const synth = new Tone.PolySynth(8, Tone.Synth, {
  oscillator: {
    type: 'sine3',
  },
  envelope: {
    attack: 0.03,
    decay: 0.1,
    sustain: 0.2,
    release: 0.6,
  },
}).toMaster();

const AudioContext = {
  playMIDINote(time, midiNote) {
    console.log('PLAY', midiNote);
    synth.triggerAttackRelease(
      midiNote.name,
      midiNote.duration,
      time,
      midiNote.velocity
    );
  },

  // TODO: Clear old ones
  loadMIDIPartInstance(midiPartInstanceId, midiNotes, startAt, endAt, offset) {
    return;

    /* Load into Tone.js */
    //Cache.midiPartInstances[midiPartInstanceId] =
    //  Cache.midiPartInstances[midiPartInstanceId] || [];

    //const instance = new Tone.Part(AudioContext.playMIDINote, midiNotes)
    //  .start(startAt, offset)
    //  .stop(instanceEndsAtSeconds);

    //Cache.midiPartInstances[midiPartInstanceId].push(instance);
  },
};

export default AudioContext;
