import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

export default CustomPIXIComponent({
  customDisplayObject: props => new PIXI.Container(),
  customApplyProps: function(instance, oldProps, newProps) {
    instance.interactive = true;
    instance.buttonMode = true;
    instance 
      .on('pointerup', newProps.onDragEnd)
      .on('pointerdown', newProps.onDragStart)
      .on('pointerupoutside', newProps.onDragEnd)
      .on('pointermove', newProps.onDragMove)
  }
}, 'DraggableContainer');
