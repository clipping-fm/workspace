import Tone from 'tone';

import Transport from 'runtime/playback/Transport';

const sound = new Tone.Synth({
  oscillator: {
    type: 'sine',
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0,
    decay: 0.1,
    sustain: 0,
    release: 0.1,
  }
}).toMaster();

const Metronome = {
  enable() {
    Transport.scheduleRepeat(time => {
      sound.triggerAttackRelease(440, "16n");
    }, "4n");
  },

  // TODO
  disable() {
  }
};

export default Metronome;
