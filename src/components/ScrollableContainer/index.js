import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Scrollbox } from './Scrollbox';

export default CustomPIXIComponent({
  customDisplayObject: props => {
    const scrollbox = new Scrollbox({ 
      boxWidth: props.width, 
      boxHeight: props.height,
      clampWheel: true
    });
    scrollbox.position.set(props.x, props.y);
    scrollbox.update();
    return scrollbox;
  },
  customApplyProps: function(instance, oldProps, newProps) {
    instance.resize(newProps.width, newProps.height);
    instance.position.set(newProps.x, newProps.y);
    instance.update();

    if (newProps.onMove) {
      instance.content.on('moved', ({ viewport }) => {
        newProps.onMove(viewport.corner);
      });
    }

    return instance;
  },
}, 'ScrollableContainer');
