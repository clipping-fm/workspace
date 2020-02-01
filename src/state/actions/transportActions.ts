import { Dispatch } from 'redux';
import Transport from 'lib/Transport';

export const playTransport = () => {
  return (dispatch: Dispatch) => {
    Transport.play();
    return dispatch({
      type: 'PlAY_TRANSPORT'
    });
  }
}

export const stopTransport = () => {
  return (dispatch: Dispatch) => {
    Transport.stop();
    return dispatch({
      type: 'STOP_TRANSPORT'
    });
  }
}

export const scrub = (to: number) => {
  return (dispatch: Dispatch) => {
    Transport.scrub(to);
    return dispatch({
      type: 'SCRUB'
    });
  }
}
