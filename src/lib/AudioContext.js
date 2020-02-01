import Tone from 'tone';

const Cache = {
  midiPartInstances: {}
};

const synth = new Tone.PolySynth(8, Tone.Synth, {
  oscillator: {
    type: "sine3"
  },
  envelope: {
    attack: .03,
    decay: .1,
    sustain: .2,
    release: .6
  }
}).toMaster();

const AudioContext = {
  playMIDINote(time, midiNote) {
    console.log('PLAY', midiNote);
    synth.triggerAttackRelease(midiNote.name, midiNote.duration, time, midiNote.velocity)
  },

  // TODO: Clear old ones
  loadMIDIPart(midiPartInstanceId, midiNotes, startAt, endAt, offset) {
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
