import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Stage } from 'react-pixi-fiber';
import Colors from 'constants/Colors';

import store from 'store';
import './index.css';
import App from './App';

const STAGE_OPTIONS = {
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoResize: true,
  backgroundColor: Colors.dark,
};

ReactDOM.render(
  <Stage options={STAGE_OPTIONS}>
    <Provider store={store}>
      <App />
    </Provider>
  </Stage>,
  document.getElementById('root')
);
