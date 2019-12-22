import Tone from 'tone';

var synth = new Tone.PolySynth(8, Tone.Synth, {
  oscillator: {
      type: "sine3"
  },
  envelope: {
      attack: .03,
      decay: .1,
      sustain: .2,
      release: .6
  }
}).toMaster()

function playNote(time, event) {
  synth.triggerAttackRelease(event.name, event.duration, time, event.velocity)
}

const Transport = {
  init() {
    Tone.Transport.timeSignature = [4,4];
    Tone.Transport.bpm.value = 120;
  },

  play() {
    Tone.Transport.start();
  },

  stop() {
    Tone.Transport.stop();
  },

  pause() {
    Tone.Transport.pause();
  },

  scrubTo(ms) {
    Tone.Transport.seconds = ms / 1000;
  },

  scheduleRepeat(callback, note) {
    Tone.Transport.scheduleRepeat(callback, note);
  },

  loadProject(project) {
    Tone.Transport.timeSignature = project.raw.header.timeSignatures[0].timeSignature;
    Tone.Transport.bpm.value = project.raw.header.tempos[0].bpm;

    project.raw.tracks.forEach(function(track) {
      track.parts.forEach(part => {
        part.instances.forEach(instance => {
          new Tone.Part(playNote, part.notes).start(instance.time);
        });
      });
    });
  },

  get isPlaying() {
    return Tone.Transport.state === "started";
  },

  get isStopped() {
    return Tone.Transport.state === "stopped";
  },

  get isPaused() {
    return Tone.Transport.state === "paused";
  },

  get position() {
    return Tone.Transport.seconds * 1000;
  },

  get beatEvery() {
    return 60000 / Tone.Transport.bpm.value;
  },

  get timeSignature() {
    return Tone.Transport.timeSignature;
  }
};

export default Transport;
