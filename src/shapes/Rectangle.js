import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

export default CustomPIXIComponent(
  {
    customDisplayObject: (props) => new PIXI.Graphics(),
    customApplyProps: function (instance, oldProps, newProps) {
      const { fill, x, y, width, height, border, alpha, click } = newProps;
      instance.clear();
      instance.beginFill(fill, alpha || 1);
      if (border) {
        instance.lineStyle(border.width, border.color, 1, 0);
      }

      if (click) {
        instance.interactive = true;
        instance.buttonMode = true;
        instance.on('pointerdown', click);
      }

      instance.drawRect(0, 0, width, height);
      instance.x = x;
      instance.y = y;
      instance.endFill();
    },
  },
  'Rectangle'
);
