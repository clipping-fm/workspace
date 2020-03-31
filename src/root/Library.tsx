import React from 'react';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';

import { Layout } from 'types';

export const LibraryConstants = {
  WIDTH: 140,
};

type Props = {
  layout: Layout;
};

export default React.memo(({ layout }: Props) => (
  <Container>
    <Rectangle
      x={layout.x}
      y={layout.y}
      width={layout.width}
      height={layout.height}
      fill={Colors.mid}
    ></Rectangle>
  </Container>
));
