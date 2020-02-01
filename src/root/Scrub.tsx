import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Colors from 'constants/Colors';
import * as PIXI from 'pixi.js';
import { scrub } from 'state/actions/transportActions';

import { Layout } from 'types';
import workspaceLayoutAttrsSelector from 'state/selectors/workspaceLayoutAttrs'; 

export const ScrubConstants = {
  HEIGHT: 10
};

type Props = {
  layout: Layout 
};

export default React.memo(({ layout }: Props) => {
  const dispatch = useDispatch();
  const { 
    viewportWidthSeconds,
    viewportLeftPositionSeconds,
  } = useSelector(workspaceLayoutAttrsSelector);

  function didClickScrub(this: PIXI.Graphics, event: PIXI.interaction.InteractionEvent) {
    const xPos = event.data.getLocalPosition(this).x
    const percentage = 
      xPos === 0 ?
      0 :
      xPos / this.width;
    const scrubToSeconds = (viewportWidthSeconds * percentage) + viewportLeftPositionSeconds;
    dispatch(scrub(scrubToSeconds));
  }

  return (
    <Container>
      <Rectangle
        x={layout.x}
        y={layout.y}
        width={layout.width} 
        height={layout.height} 
        fill={Colors.mid}
        onClick={didClickScrub}
      >
      </Rectangle>
    </Container>
  );
});
