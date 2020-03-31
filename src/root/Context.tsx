import React from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-pixi-fiber';
import Rectangle from 'shapes/Rectangle';
import Button from 'components/Button';
import Colors from 'constants/Colors';

//import { updateProjectAttribute } from 'state/actions/projectActions';
import { setViewportLeftPosition } from 'state/actions/workspaceActions';
import { Layout } from 'types';

export const ContextConstants = {
  HEIGHT: 200,
};

type Props = {
  layout: Layout;
};

export default React.memo(({ layout }: Props) => {
  const dispatch = useDispatch();

  //const attrUpdater = {
  //  id: '7a2abcd7-e0e2-4b30-9e8a-9bfb6b0a0a55',
  //  type: 'midiPartInstances',
  //  keyValuePairs: [{
  //    attribute: 'duration',
  //    value: '7m'
  //  }]
  //};

  //const attrUpdater = {
  //  id: '5ddaff9b-4051-49d1-92c7-48dc3f8fe8a5',
  //  type: 'midiPartInstances',
  //  keyValuePairs: [{
  //    attribute: 'duration',
  //    value: '6m'
  //  }, {
  //    attribute: 'time',
  //    value: '6m'
  //  }, {
  //    attribute: 'offset',
  //    value: '1m'
  //  }]
  //};

  return (
    <Container>
      <Rectangle
        x={layout.x}
        y={layout.y}
        width={layout.width}
        height={layout.height}
        fill={Colors.mid}
      >
        <Button
          x={10}
          y={10}
          width={100}
          height={100}
          fill={Colors.light}
          click={() => dispatch(setViewportLeftPosition(5))}
        />
      </Rectangle>
    </Container>
  );
});
