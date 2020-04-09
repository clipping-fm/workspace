import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

export default CustomPIXIComponent(
  {
    customDisplayObject: (props) => new PIXI.Container(),
    customWillDetach(instance) {
      instance.off('pointerdown', instance._handleDragStart);
    },
    customApplyProps(instance, oldProps, newProps) {
      instance.interactive = true;

      instance.cursor = 'grab';

      const handleDragStart = (event) => {
        newProps.onDragStart(event);

        instance.cursor = 'grabbing';

        instance.on('pointermove', handleDragMove);
        instance.on('pointerup', handleDragEnd);
      };

      const handleDragMove = (event) => {
        newProps.onDragMove(event);

        instance.cursor = 'grabbing';
      };

      const handleDragEnd = (event) => {
        newProps.onDragEnd(event);

        instance.cursor = 'grab';

        instance.off('pointermove', handleDragMove);
        instance.off('pointerup', handleDragEnd);
      };

      if (instance._handleDragStart) {
        instance.off('pointerdown', instance._handleDragStart);
      }

      instance._handleDragStart = handleDragStart;
      instance.on('pointerdown', instance._handleDragStart);
    },
  },
  'DraggableContainer'
);
