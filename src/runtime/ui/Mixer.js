import * as PIXI from 'pixi.js';
import { 
  initBackground, 
  drawBackground 
} from 'runtime/ui/common/hasBackground';
import NumericalControl from 'runtime/ui/common/NumericalControl';
import VolumeSlider, { Constants as VolumeSliderConstants } from 'runtime/ui/common/VolumeSlider';
import GlobalConstants from 'runtime/ui/common/GlobalConstants';

const Constants = {
  TOGGLE_WIDTH: 10,
  SPACER: 4
};

function makeInner(self) {
  let inner = self.getChildByName('inner');
  if (!inner) {
    inner = new PIXI.Container();
    inner.name = 'inner';
    self.addChild(inner);
  }
  return inner;
};

function makeMixers(inner) {
  const mixerContainer = new PIXI.Graphics()
    .beginFill(0xDE3249, 1)
    .drawRect(0, 0, inner.parent.width, GlobalConstants.EXPANDED_TRACK_HEIGHT)
    .endFill();
  mixerContainer.name = 'mixer';

  const trackToggle = new PIXI.Graphics()
    .lineStyle(0)
    .beginFill(0xBEBEBE,1)
    .drawCircle(
      0, 0, Constants.TOGGLE_WIDTH
    ).endFill();
  trackToggle.x = Constants.TOGGLE_WIDTH + Constants.SPACER;
  trackToggle.y = Constants.TOGGLE_WIDTH + VolumeSliderConstants.NOTCH_HEIGHT/2;
  trackToggle.interactive = true;
  trackToggle.buttonMode = true;
  //trackToggle.on('pointerdown', () => Events.trigger('intent.RECORD'));
  mixerContainer.addChild(trackToggle);

  const soloToggle = new PIXI.Graphics()
    .lineStyle(0)
    .beginFill(0xBEBEBE,1)
    .drawCircle(
      0, 0, Constants.TOGGLE_WIDTH
    ).endFill();
  soloToggle.x = Constants.TOGGLE_WIDTH + Constants.SPACER;
  soloToggle.y = Constants.TOGGLE_WIDTH * 4 + VolumeSliderConstants.NOTCH_HEIGHT/2;
  soloToggle.interactive = true;
  soloToggle.buttonMode = true;
  //trackToggle.on('pointerdown', () => Events.trigger('intent.RECORD'));
  mixerContainer.addChild(soloToggle);

  const recordToggle = new PIXI.Graphics()
    .lineStyle(0)
    .beginFill(0xBEBEBE,1)
    .drawCircle(
      0, 0, Constants.TOGGLE_WIDTH
    ).endFill();
  recordToggle.x = Constants.TOGGLE_WIDTH + Constants.SPACER;
  recordToggle.y = Constants.TOGGLE_WIDTH * 7 + VolumeSliderConstants.NOTCH_HEIGHT/2;
  recordToggle.interactive = true;
  recordToggle.buttonMode = true;
  //trackToggle.on('pointerdown', () => Events.trigger('intent.RECORD'));
  mixerContainer.addChild(recordToggle);

  // Volume Slider
  const volumeSlider = VolumeSlider.init();
  VolumeSlider.setHeight(volumeSlider, 140);
  VolumeSlider.setOnMove(volumeSlider, (position) => {
    console.log(position);
  });
  volumeSlider.x = Constants.TOGGLE_WIDTH * 2 + Constants.SPACER * 3;
  mixerContainer.addChild(volumeSlider);

  // Volume numerical control
  const volumeControl = NumericalControl.init();
  volumeControl.y = volumeSlider.height + Constants.SPACER;
  mixerContainer.addChild(volumeControl);

  // Pan Control
  const panControl = NumericalControl.init();
  panControl.y = volumeControl.y + volumeControl.height + Constants.SPACER;
  mixerContainer.addChild(panControl);

  inner.addChild(mixerContainer);
};

const Mixer = {
  Constants: {
    WIDTH: 100
  },

  init(layout) {
    const self = new PIXI.Container();
    initBackground(self, layout);
    return self;
  },

  draw(self, layout) {
    if (!self) return;
    if (layout) drawBackground(self, layout);

    const inner = makeInner(self);
    makeMixers(inner);

    return self;
  }
};

export default Mixer;
