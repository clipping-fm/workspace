import React from 'react';
import { AppContext, Stage } from 'react-pixi-fiber';
import Colors from 'constants/Colors';
import Root from 'root';

const STAGE_OPTIONS = {
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  resolution: (window.devicePixelRatio || 1),
  autoResize: true,
  backgroundColor: Colors.dark
};

export default React.memo(() => (
  <Stage options={STAGE_OPTIONS}>
    <AppContext.Consumer>
      {app => <Root app={app} />}
    </AppContext.Consumer>
  </Stage>
));
