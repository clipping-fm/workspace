import React, { memo, useContext } from 'react';
import { useDispatch } from 'react-redux';
import * as PIXI from 'pixi.js';
import { AppContext as PIXIAppContext } from 'react-pixi-fiber';

import Controls, { ControlsConstants } from 'root/Controls';
import Context, { ContextConstants } from 'root/Context';
import Library, { LibraryConstants } from 'root/Library';
import Minimap, { MinimapConstants } from 'root/Minimap';
import Scrub, { ScrubConstants } from 'root/Scrub';
import Mixer, { MixerConstants } from 'root/Mixer';
import Workspace from 'root/Workspace';
import { setWorkspaceLayout } from 'state/actions/workspaceActions';

import { Layout } from 'types';

export const GlobalConstants = {
  PADDING: 4,
};

const Root = () => {
  const app: PIXI.Application = useContext(PIXIAppContext);
  const dispatch = useDispatch();

  const ControlsLayout: Layout = {
    x: 0,
    y: 0,
    width: app.screen.width,
    height: ControlsConstants.HEIGHT,
  };

  const ContextLayout: Layout = {
    x: 0,
    y: app.screen.height - ContextConstants.HEIGHT,
    width: app.screen.width,
    height: ContextConstants.HEIGHT,
  };

  const LibraryLayout: Layout = {
    x: 0,
    y: ControlsLayout.height + GlobalConstants.PADDING,
    width: LibraryConstants.WIDTH,
    height:
      app.screen.height -
      ControlsLayout.height -
      ContextLayout.height -
      GlobalConstants.PADDING * 2,
  };

  const MinimapLayout: Layout = {
    x:
      LibraryLayout.width +
      GlobalConstants.PADDING +
      MixerConstants.WIDTH +
      GlobalConstants.PADDING,
    y: ControlsLayout.height + GlobalConstants.PADDING,
    width:
      app.screen.width -
      LibraryLayout.width -
      GlobalConstants.PADDING -
      MixerConstants.WIDTH -
      GlobalConstants.PADDING,
    height: MinimapConstants.HEIGHT,
  };

  const ScrubLayout: Layout = {
    x:
      LibraryLayout.width +
      GlobalConstants.PADDING +
      MixerConstants.WIDTH +
      GlobalConstants.PADDING,
    y:
      ControlsLayout.height +
      GlobalConstants.PADDING +
      MinimapLayout.height +
      GlobalConstants.PADDING,
    width:
      app.screen.width -
      LibraryLayout.width -
      GlobalConstants.PADDING -
      MixerConstants.WIDTH -
      GlobalConstants.PADDING,
    height: ScrubConstants.HEIGHT,
  };

  const MixerLayout: Layout = {
    x: LibraryLayout.width + GlobalConstants.PADDING,
    y:
      ControlsLayout.height +
      GlobalConstants.PADDING +
      MinimapLayout.height +
      GlobalConstants.PADDING +
      ScrubLayout.height +
      GlobalConstants.PADDING,
    width: MixerConstants.WIDTH,
    height:
      app.screen.height -
      ControlsLayout.height -
      GlobalConstants.PADDING -
      MinimapLayout.height -
      GlobalConstants.PADDING -
      ScrubLayout.height -
      GlobalConstants.PADDING -
      GlobalConstants.PADDING -
      ContextLayout.height,
  };

  const WorkspaceLayout: Layout = {
    x:
      LibraryLayout.width +
      GlobalConstants.PADDING +
      MixerLayout.width +
      GlobalConstants.PADDING,
    y:
      ControlsLayout.height +
      GlobalConstants.PADDING +
      MinimapLayout.height +
      GlobalConstants.PADDING +
      ScrubLayout.height +
      GlobalConstants.PADDING,
    width:
      app.screen.width -
      LibraryLayout.width -
      GlobalConstants.PADDING -
      MixerLayout.width -
      GlobalConstants.PADDING,
    height:
      app.screen.height -
      ControlsLayout.height -
      GlobalConstants.PADDING -
      MinimapLayout.height -
      GlobalConstants.PADDING -
      ScrubLayout.height -
      GlobalConstants.PADDING -
      GlobalConstants.PADDING -
      ContextLayout.height,
  };

  dispatch(setWorkspaceLayout(WorkspaceLayout));
  console.log('render <Root />');
  return (
    <>
      <Controls layout={ControlsLayout} />
      <Context layout={ContextLayout} />
      <Library layout={LibraryLayout} />
      <Minimap layout={MinimapLayout} />
      <Scrub layout={ScrubLayout} />
      <Mixer layout={MixerLayout} />
      <Workspace layout={WorkspaceLayout} />
    </>
  );
};

export default memo(Root);
