import React from 'react';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';

export const ContextConstants = {
  HEIGHT: 200
};

export default React.memo(({layout}) => (
  <Container>
    <Rectangle
      x={layout.x}
      y={layout.y}
      width={layout.width} 
      height={layout.height} 
      fill={Colors.mid}
    >
    </Rectangle>
  </Container>
));
