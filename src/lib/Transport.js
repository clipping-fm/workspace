import Tone from 'tone';

// TODO: Type this file
export default {
  play() {
    Tone.Transport.start();
  },

  stop() {
    Tone.Transport.stop();
  },

  scrub(to) {
    Tone.Transport.seconds = to;
  },

  get positionInSeconds() {
    return Tone.Transport.seconds;
  },

  toBarsBeatsSixteenths(seconds) {
    return Tone.Time(seconds).toBarsBeatsSixteenths();
  },

  toNotation(seconds) {
    return Tone.Time(seconds).toNotation();
  },

  toSeconds(time) {
    return Tone.Time(time).toSeconds();
  },
};
