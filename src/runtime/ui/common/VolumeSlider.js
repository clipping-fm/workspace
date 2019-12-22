import * as PIXI from 'pixi.js';
import makeTriangle from 'runtime/utils/makeTriangle';
import remap from 'runtime/utils/remap';

export const Constants = {
  CHANNEL_WIDTH: 8,
  SPACER: 4,
  NOTCH_HEIGHT: 20,
};

let DRAG_DATA = null;

function onNotchDragStart(event) {
  DRAG_DATA = {
    xOriginal: event.data.getLocalPosition(this.parent).x,
    yOriginal: event.data.getLocalPosition(this.parent).y,
    xDelta: 0,
    yDelta: 0,
    event
  };
};

function oonNotchMove() {
  if (!DRAG_DATA) return;
  DRAG_DATA = {
    ...DRAG_DATA,
    xDelta: DRAG_DATA.event.data.getLocalPosition(this.parent).x - DRAG_DATA.xOriginal,
    yDelta: DRAG_DATA.event.data.getLocalPosition(this.parent).y - DRAG_DATA.yOriginal
  };

  const highEndRange = this.parent.getChildByName('background').height - Constants.NOTCH_HEIGHT;
  this.y = 
    Math.max(
      Math.min(
        DRAG_DATA.yOriginal + DRAG_DATA.yDelta, 
        highEndRange
      ),
      0
    );

  if (this.parent._daw) {
    this.parent._daw.onMove(remap(this.y, highEndRange, 0, 0, 1));
  }
};
 
function onNotchDragEnd() {
  if (DRAG_DATA) DRAG_DATA = null;
};

const VerticalSlider = {
  init() {
    const slider = new PIXI.Container();
    slider.name = 'slider';

    const background = new PIXI.Graphics()
      .beginFill(0xffffff, 0)
      .drawRect(
        0, 
        0, 
        (
          Constants.CHANNEL_WIDTH * 2 +
          Constants.SPACER * 2 +
          Constants.NOTCH_HEIGHT
        ),
        100
      )
      .endFill();
    background.name = 'background';
    slider.addChild(background);

    const leftChannel = new PIXI.Graphics()
      .beginFill(0xBEBEBE, 1)
      .drawRect(0, 0, Constants.CHANNEL_WIDTH, background.height - Constants.NOTCH_HEIGHT)
      .endFill();
    leftChannel.name = 'leftChannel';
    leftChannel.y = Constants.NOTCH_HEIGHT/2;

    const leftChannelBar = new PIXI.Graphics()
      .beginFill(0x000000, 1)
      .drawRect(0, 0, leftChannel.width, 50)
      .endFill();
    leftChannelBar.name = 'leftChannelBar';
    leftChannelBar.y = leftChannel.height - leftChannelBar.height;
    leftChannel.addChild(leftChannelBar);
    slider.addChild(leftChannel);

    const rightChannel = new PIXI.Graphics()
      .beginFill(0xBEBEBE, 1)
      .drawRect(
        0,
        0,
        Constants.CHANNEL_WIDTH, 
        background.height - Constants.NOTCH_HEIGHT
      )
      .endFill();
    rightChannel.x = Constants.CHANNEL_WIDTH + Constants.SPACER;
    rightChannel.name = 'rightChannel';
    rightChannel.y = Constants.NOTCH_HEIGHT/2;

    const rightChannelBar = new PIXI.Graphics()
      .beginFill(0x000000, 1)
      .drawRect(0, 0, rightChannel.width, 50)
      .endFill();
    rightChannelBar.name = 'rightChannelBar';
    rightChannelBar.y = rightChannel.height - rightChannelBar.height;
    rightChannel.addChild(rightChannelBar);
    slider.addChild(rightChannel);

    const notch = makeTriangle(
      0, 
      0, 
      Constants.NOTCH_HEIGHT, 
      0xBEBEBE
    );
    notch.name = 'notch';
    // TODO: rotate me
    notch.x = (
      Constants.CHANNEL_WIDTH * 2 +
      Constants.SPACER * 2
    );

    notch.interactive = true;
    notch.buttonMode = true;

    notch 
      .on('pointerup', onNotchDragEnd)
      .on('pointerdown', onNotchDragStart)
      .on('pointerupoutside', onNotchDragEnd)
      .on('pointermove', oonNotchMove)

    slider.addChild(notch);
    return slider;
  },

  setHeight(self, height) {
    const background = self.getChildByName('background');
    background.height = height;
    const leftChannel = self.getChildByName('leftChannel');
    leftChannel.height = background.height - Constants.NOTCH_HEIGHT;
    const rightChannel = self.getChildByName('rightChannel');
    rightChannel.height = background.height - Constants.NOTCH_HEIGHT;
    return self;
  },

  setOnMove(self, onMove) {
    self._daw = { onMove };
    return self;
  }
};

export default VerticalSlider;
