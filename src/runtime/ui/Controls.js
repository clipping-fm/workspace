import * as PIXI from 'pixi.js';
import { initBackground, drawBackground } from 'runtime/ui/common/hasBackground';
import makeTriangle from 'runtime/utils/makeTriangle';
import Events from 'runtime/Events';

const Controls = {
  Constants: {
    HEIGHT: 40,
    SPACING_COEFFICIENT: 1.75
  },

  init(layout) {
    const self = new PIXI.Container();
    initBackground(self, layout);

    const playButton = makeTriangle(
      0, 
      Controls.Constants.HEIGHT/4, 
      Controls.Constants.HEIGHT/2, 
      0xDE3249
    );
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on('pointerdown', () => Events.trigger('intent.TOGGLE_PLAY'));
    self.addChild(playButton);

    const stopButton = new PIXI.Graphics()
      .beginFill(0xDE3249, 1)
      .drawRect(
        Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT, 
        Controls.Constants.HEIGHT/4, 
        Controls.Constants.HEIGHT/2, 
        Controls.Constants.HEIGHT/2
      ).endFill();
    stopButton.interactive = true;
    stopButton.buttonMode = true;
    stopButton.on('pointerdown', () => Events.trigger('intent.STOP'));
    self.addChild(stopButton);

    const recordButton = new PIXI.Graphics()
      .lineStyle(0)
      .beginFill(0xDE3249,1)
      .drawCircle(
        Controls.Constants.HEIGHT/4 + (
          Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 2
        ),
        Controls.Constants.HEIGHT/2,
        Controls.Constants.HEIGHT/4, 
      ).endFill();
    recordButton.interactive = true;
    recordButton.buttonMode = true;
    recordButton.on('pointerdown', () => Events.trigger('intent.RECORD'));
    self.addChild(recordButton);

    const zoomOutButton = new PIXI.Graphics()
      .lineStyle(0)
      .beginFill(0xDE3249,1)
      .drawCircle(
        Controls.Constants.HEIGHT/4 + (
          Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 3
        ),
        Controls.Constants.HEIGHT/2, 
        Controls.Constants.HEIGHT/4
      ).endFill();
    zoomOutButton.interactive = true;
    zoomOutButton.buttonMode = true;
    zoomOutButton.on('pointerdown', () => Events.trigger('intent.ZOOM_OUT'));
    self.addChild(zoomOutButton);
    const zoomOutText = new PIXI.Text("-", {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: "white",
      align: 'right'
    });
    zoomOutText.anchor.set(0.5, 0.5);
    zoomOutText.position.set(
      Controls.Constants.HEIGHT/4 + (
        Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 3
      ),
      Controls.Constants.HEIGHT/2, 
    );
    zoomOutButton.addChild(zoomOutText);

    const zoomInButton = new PIXI.Graphics()
      .lineStyle(0)
      .beginFill(0xDE3249,1)
      .drawCircle(
        Controls.Constants.HEIGHT/4 + (
          Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 4
        ),
        Controls.Constants.HEIGHT/2, 
        Controls.Constants.HEIGHT/4
      ).endFill();
    zoomInButton.interactive = true;
    zoomInButton.buttonMode = true;
    zoomInButton.on('pointerdown', () => Events.trigger('intent.ZOOM_IN'));
    self.addChild(zoomInButton);
    const zoomInText = new PIXI.Text("+", {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: "white",
      align: 'right'
    });
    zoomInText.anchor.set(0.5, 0.5);
    zoomInText.position.set(
      Controls.Constants.HEIGHT/4 + (
        Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 4
      ),
      Controls.Constants.HEIGHT/2, 
    );
    zoomInButton.addChild(zoomInText);

    /* Pan Left */
    const panLeftButton = new PIXI.Graphics()
      .lineStyle(0)
      .beginFill(0xDE3249,1)
      .drawCircle(
        Controls.Constants.HEIGHT/4 + (
          Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 5
        ),
        Controls.Constants.HEIGHT/2, 
        Controls.Constants.HEIGHT/4
      ).endFill();
    panLeftButton.interactive = true;
    panLeftButton.buttonMode = true;
    panLeftButton.on('pointerdown', () => Events.trigger('intent.PAN_LEFT'));
    self.addChild(panLeftButton);
    const panLeftText = new PIXI.Text("<", {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: "white",
      align: 'right'
    });
    panLeftText.anchor.set(0.5, 0.5);
    panLeftText.position.set(
      Controls.Constants.HEIGHT/4 + (
        Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 5
      ),
      Controls.Constants.HEIGHT/2, 
    );
    panLeftButton.addChild(panLeftText);

    /* Pan Right */
    const panRightButton = new PIXI.Graphics()
      .lineStyle(0)
      .beginFill(0xDE3249,1)
      .drawCircle(
        Controls.Constants.HEIGHT/4 + (
          Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 6
        ),
        Controls.Constants.HEIGHT/2, 
        Controls.Constants.HEIGHT/4
      ).endFill();
    panRightButton.interactive = true;
    panRightButton.buttonMode = true;
    panRightButton.on('pointerdown', () => Events.trigger('intent.PAN_RIGHT'));
    self.addChild(panRightButton);
    const panRightText = new PIXI.Text(">", {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: "white",
      align: 'right'
    });
    panRightText.anchor.set(0.5, 0.5);
    panRightText.position.set(
      Controls.Constants.HEIGHT/4 + (
        Controls.Constants.HEIGHT/2 * Controls.Constants.SPACING_COEFFICIENT * 6
      ),
      Controls.Constants.HEIGHT/2, 
    );
    panRightButton.addChild(panRightText);

    return self;
  },

  draw(self, layout) {
    if (!self) return;
    if (layout) drawBackground(self, layout);
    return self;
  }
};

export default Controls;
