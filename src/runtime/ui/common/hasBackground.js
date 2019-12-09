import * as PIXI from 'pixi.js';
const BACKGROUND = 'background';
const MASK = 'mask';

export const initBackground = (container, layout, backgroundColor = 0x444444) => {
  const { x, y, width, height } = layout;
  const background = new PIXI.Graphics()
    .beginFill(backgroundColor, 1)
    .drawRect(0, 0, width, height)
    .endFill();
  background.name = BACKGROUND;
  container.x = x;
  container.y = y;
  container.addChild(background);

  const mask = new PIXI.Graphics()
    .beginFill(backgroundColor, 1)
    .drawRect(0, 0, width, height)
    .endFill();
  mask.name = MASK;
  container.addChild(mask);
  container.mask = mask;

  return background;
};

export const drawBackground = (container, layout) => {
  const { x, y, width, height } = layout;
  const background = getBackground(container);
  background.width = width;
  background.height = height;

  const mask = getMask(container);
  mask.width = width;
  mask.height = height;

  container.x = x;
  container.y = y;
  return background;
};

export const getBackground = (container) => {
  return container.getChildByName(BACKGROUND);
};

export const getMask = (container) => {
  return container.getChildByName(MASK);
};
