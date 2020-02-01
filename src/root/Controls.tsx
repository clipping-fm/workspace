import React from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Triangle from 'shapes/Triangle';
import Colors from 'constants/Colors';
import { Layout } from 'types';
import { GlobalConstants } from 'root';
import { playTransport, stopTransport } from 'state/actions/transportActions';

export const ControlsConstants = {
  HEIGHT: 40
};

type Props = {
  layout: Layout 
};

export default React.memo(({ layout }: Props) => {
  const dispatch = useDispatch();

  return (
    <Container>
      <Rectangle
        x={layout.x}
        y={layout.y}
        width={layout.width} 
        height={layout.height} 
        fill={Colors.mid}
      >
        <Triangle 
          x={GlobalConstants.PADDING*2} 
          y={ControlsConstants.HEIGHT/4} 
          fill={Colors.light} 
          width={ControlsConstants.HEIGHT/2} 
          onClick={() => dispatch(playTransport())}
        />
        <Rectangle
          x={(
            GlobalConstants.PADDING*2 +
            ControlsConstants.HEIGHT/2 +
            GlobalConstants.PADDING*2
          )}
          y={ControlsConstants.HEIGHT/4}
          height={ControlsConstants.HEIGHT/2}
          width={ControlsConstants.HEIGHT/2}
          fill={Colors.light}
          onClick={() => dispatch(stopTransport())}
        />
      </Rectangle>
    </Container>
  );
});
