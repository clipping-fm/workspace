import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

export default CustomPIXIComponent({
  customDisplayObject: props => new PIXI.Graphics(),

  customApplyProps: function(instance, oldProps, newProps) {
    const { x, y, width, fill, alpha, onClick } = newProps;
    instance.clear();

    const triangleWidth = width;
    const triangleHeight = triangleWidth;
    const triangleHalfway = triangleWidth/2;

    instance.beginFill(fill, alpha || 1);
    instance.lineStyle(0, fill, 1);
    instance.moveTo(0, triangleHeight);
    instance.lineTo(triangleWidth, triangleHalfway); 
    instance.lineTo(0, 0);
    instance.lineTo(0, triangleHeight);

    instance.x = x;
    instance.y = y;
    instance.endFill();

    if (onClick) {
      instance.interactive = true;
      instance.buttonMode = true;
      instance.on('pointerdown', newProps.onClick);
    }
  }
}, 'Triangle');
