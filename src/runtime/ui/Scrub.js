import * as PIXI from 'pixi.js';
import { initBackground, drawBackground } from 'runtime/ui/common/hasBackground';
import Events from 'runtime/Events';
import { PIXI } from 'pixi.js';

const Scrub = {
  Constants: {
    HEIGHT: 10
  },

  init(layout) {
    const self = new PIXI.Container();
    const background = initBackground(self, layout);
    background.interactive = true;
    background.buttonMode = true;
    background.on('pointerdown', function(event) {
      const xPos = event.data.getLocalPosition(this.parent).x
      const percentage = 
        xPos === 0 ?
        0 :
        xPos / this.parent.width;
      Events.trigger('intent.SCRUB', percentage);
    });
    return self;
  },

  draw(self, layout) {
    if (!self) return;
    drawBackground(self, layout);
    return self;
  }
};

export default Scrub; 
