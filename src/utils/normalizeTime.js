import Tone from 'tone';

// TODO: memo
export default (time) => {
  if (typeof time === "string") {
    return Tone.Time(time).toSeconds();
  }
  return time;
};
