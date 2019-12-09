import * as PIXI from 'pixi.js';
import { initBackground, drawBackground } from 'runtime/ui/common/hasBackground';

const Context = {
  Constants: {
    HEIGHT: 200
  },

  init(layout) {
    const self = new PIXI.Container();
    initBackground(self, layout);
    return self;
  },

  draw(self, layout) {
    if (layout) drawBackground(self, layout);
    return self;
  }
};

export default Context;
