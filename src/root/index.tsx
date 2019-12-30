import React from 'react';
import * as PIXI from 'pixi.js';

import Controls, { ControlsConstants } from 'root/Controls';
import Context, { ContextConstants } from 'root/Context';
import Library, { LibraryConstants } from 'root/Library';
import Minimap, { MinimapConstants } from 'root/Minimap';
import Scrub, { ScrubConstants } from 'root/Scrub';
import Mixer, { MixerConstants } from 'root/Mixer';

const GlobalConstants = {
  PADDING: 4
};

type RootProps = {
  app: PIXI.Application
};

export default React.memo(({ app }: RootProps) => {
  const ControlsLayout = {
    x: 0,
    y: 0,
    width: app.screen.width,
    height: ControlsConstants.HEIGHT
  };

  const ContextLayout = { 
    x: 0,
    y: app.screen.height - ContextConstants.HEIGHT,
    width: app.screen.width,
    height: ContextConstants.HEIGHT
  };

  const LibraryLayout = { 
    x: 0,
    y: (
      ControlsLayout.height + 
      GlobalConstants.PADDING
    ),
    width: LibraryConstants.WIDTH,
    height: (
      app.screen.height - 
      ControlsLayout.height - 
      ContextLayout.height -
      (GlobalConstants.PADDING * 2)
    )
  };

  const MinimapLayout = {
    x: LibraryLayout.width + GlobalConstants.PADDING,
    y: ControlsLayout.height + GlobalConstants.PADDING,
    width: (
      app.screen.width -
      LibraryLayout.width -
      GlobalConstants.PADDING
    ),
    height: MinimapConstants.HEIGHT
  };

  const ScrubLayout = {
    x: (
      LibraryLayout.width + 
      GlobalConstants.PADDING + 
      MixerConstants.WIDTH +
      GlobalConstants.PADDING
    ),
    y: (
      ControlsLayout.height + 
      GlobalConstants.PADDING +
      MinimapLayout.height + 
      GlobalConstants.PADDING
    ),
    width: (
      app.screen.width -
      LibraryLayout.width -
      GlobalConstants.PADDING
    ),
    height: ScrubConstants.HEIGHT
  };

  const MixerLayout = {
    x: LibraryLayout.width + GlobalConstants.PADDING,
    y: (
      ControlsLayout.height + 
      GlobalConstants.PADDING +
      MinimapLayout.height + 
      GlobalConstants.PADDING +
      ScrubLayout.height +
      GlobalConstants.PADDING
    ),
    width: MixerConstants.WIDTH,
    height: (
      app.screen.height -
      ControlsLayout.height - 
      GlobalConstants.PADDING -
      MinimapLayout.height - 
      GlobalConstants.PADDING -
      ScrubLayout.height -
      GlobalConstants.PADDING -
      GlobalConstants.PADDING -
      ContextLayout.height
    )
  };

  return (
    <>
      <Controls layout={ControlsLayout} />
      <Context layout={ContextLayout} />
      <Library layout={LibraryLayout} />
      <Minimap layout={MinimapLayout} />
      <Scrub layout={ScrubLayout} />
      <Mixer layout={MixerLayout} />
    </>
  );
});
