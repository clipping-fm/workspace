import * as PIXI from 'pixi.js';
import { initBackground, drawBackground } from 'runtime/ui/common/hasBackground';

const Library = {
  Constants: {
    WIDTH: 140
  },

  init(layout) {
    const self = new PIXI.Container();
    initBackground(self, layout);
    return self;
  },

  draw(self, layout) {
    if (!self) return;
    drawBackground(self, layout);
    return self;
  }
};

export default Library;
