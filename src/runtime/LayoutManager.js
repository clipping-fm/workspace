import UIRegistry from 'runtime/UIRegistry';

import Workspace from 'runtime/ui/Workspace';
import Minimap from 'runtime/ui/Minimap';
import Context from 'runtime/ui/Context';
import Library from 'runtime/ui/Library';
import Scrub from 'runtime/ui/Scrub';
import Mixer from 'runtime/ui/Mixer';
import Controls from 'runtime/ui/Controls';

const LayoutManager = {
  Constants: {
    padding: 10
  },

  init(app) {
    /* Controls is the top bar */
    const ControlsLayout = {
      x: 0,
      y: 0,
      width: app.screen.width,
      height: Controls.Constants.HEIGHT
    };

    /* Context is the bottom bar */
    const ContextLayout = { 
      x: 0,
      y: app.screen.height - Context.Constants.HEIGHT,
      width: app.screen.width,
      height: Context.Constants.HEIGHT
    };

    /* Library is the left bar */
    const LibraryLayout = { 
      x: 0,
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding
      ),
      width: Library.Constants.WIDTH,
      height: (
        app.screen.height - 
        ControlsLayout.height - 
        ContextLayout.height -
        (LayoutManager.Constants.padding * 2)
      )
    };
    
    /* Minimap is the left bar */
    const MinimapLayout = {
      x: LibraryLayout.width + LayoutManager.Constants.padding,
      y: ControlsLayout.height + LayoutManager.Constants.padding,
      width: (
        app.screen.width -
        LibraryLayout.width -
        LayoutManager.Constants.padding
      ),
      height: Minimap.Constants.HEIGHT
    };

    /* Scrub is the left bar */
    const ScrubLayout = {
      x: LibraryLayout.width + LayoutManager.Constants.padding,
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding +
        MinimapLayout.height + 
        LayoutManager.Constants.padding
      ),
      width: (
        app.screen.width -
        LibraryLayout.width -
        LayoutManager.Constants.padding
      ),
      height: Scrub.Constants.HEIGHT
    };

    /* Mixer is the left bar */
    const MixerLayout = {
      x: LibraryLayout.width + LayoutManager.Constants.padding,
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding +
        MinimapLayout.height + 
        LayoutManager.Constants.padding
      ),
      width: Mixer.Constants.WIDTH,
      height: (
        app.screen.height -
        ControlsLayout.height - 
        LayoutManager.Constants.padding -
        MinimapLayout.height - 
        LayoutManager.Constants.padding -
        LayoutManager.Constants.padding -
        ContextLayout.height
      )
    };

    /* Workspace is the left bar */
    const WorkspaceLayout = {
      x: (
        LibraryLayout.width + 
        LayoutManager.Constants.padding + 
        MixerLayout.width +
        LayoutManager.Constants.padding
      ),
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding +
        MinimapLayout.height + 
        LayoutManager.Constants.padding
      ),
      width: (
        app.screen.width -
        LibraryLayout.width -
        LayoutManager.Constants.padding - 
        MixerLayout.width -
        LayoutManager.Constants.padding
      ),
      height: (
        app.screen.height -
        ControlsLayout.height - 
        LayoutManager.Constants.padding -
        MinimapLayout.height - 
        LayoutManager.Constants.padding -
        LayoutManager.Constants.padding -
        ContextLayout.height
      )
    };
    
    UIRegistry.main = Controls.init(ControlsLayout);
    app.stage.addChild(UIRegistry.main);

    UIRegistry.context = Context.init(ContextLayout);
    app.stage.addChild(UIRegistry.context);

    UIRegistry.library = Library.init(LibraryLayout);
    app.stage.addChild(UIRegistry.library);

    UIRegistry.minimap = Minimap.init(app, MinimapLayout);
    app.stage.addChild(UIRegistry.minimap);

    UIRegistry.scrub = Scrub.init(ScrubLayout);
    app.stage.addChild(UIRegistry.scrub);

    UIRegistry.mixer = Mixer.init(MixerLayout);
    app.stage.addChild(UIRegistry.mixer);

    UIRegistry.workspace = Workspace.init(app, WorkspaceLayout);
    app.stage.addChild(UIRegistry.workspace);
  },

  draw(app) {
    const ControlsLayout = {
      x: 0,
      y: 0,
      width: app.screen.width,
      height: Controls.Constants.HEIGHT
    };

    const ContextLayout = { 
      x: 0,
      y: app.screen.height - Context.Constants.HEIGHT,
      width: app.screen.width,
      height: Context.Constants.HEIGHT
    };

    const LibraryLayout = { 
      x: 0,
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding
      ),
      width: Library.Constants.WIDTH,
      height: (
        app.screen.height - 
        ControlsLayout.height - 
        ContextLayout.height -
        (LayoutManager.Constants.padding * 2)
      )
    };

    const MinimapLayout = {
      x: LibraryLayout.width + LayoutManager.Constants.padding,
      y: ControlsLayout.height + LayoutManager.Constants.padding,
      width: (
        app.screen.width -
        LibraryLayout.width -
        LayoutManager.Constants.padding
      ),
      height: Minimap.Constants.HEIGHT
    };

    const ScrubLayout = {
      x: (
        LibraryLayout.width + 
        LayoutManager.Constants.padding + 
        Mixer.Constants.WIDTH +
        LayoutManager.Constants.padding
      ),
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding +
        MinimapLayout.height + 
        LayoutManager.Constants.padding
      ),
      width: (
        app.screen.width -
        LibraryLayout.width -
        LayoutManager.Constants.padding
      ),
      height: Scrub.Constants.HEIGHT
    };

    const MixerLayout = {
      x: LibraryLayout.width + LayoutManager.Constants.padding,
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding +
        MinimapLayout.height + 
        LayoutManager.Constants.padding +
        ScrubLayout.height +
        LayoutManager.Constants.padding
      ),
      width: Mixer.Constants.WIDTH,
      height: (
        app.screen.height -
        ControlsLayout.height - 
        LayoutManager.Constants.padding -
        MinimapLayout.height - 
        LayoutManager.Constants.padding -
        ScrubLayout.height -
        LayoutManager.Constants.padding -
        LayoutManager.Constants.padding -
        ContextLayout.height
      )
    };

    const WorkspaceLayout = {
      x: (
        LibraryLayout.width + 
        LayoutManager.Constants.padding + 
        MixerLayout.width +
        LayoutManager.Constants.padding
      ),
      y: (
        ControlsLayout.height + 
        LayoutManager.Constants.padding +
        MinimapLayout.height + 
        LayoutManager.Constants.padding +
        ScrubLayout.height +
        LayoutManager.Constants.padding
      ),
      width: (
        app.screen.width -
        LibraryLayout.width -
        LayoutManager.Constants.padding
      ),
      height: (
        app.screen.height -
        ControlsLayout.height - 
        LayoutManager.Constants.padding -
        MinimapLayout.height - 
        LayoutManager.Constants.padding -
        ScrubLayout.height -
        LayoutManager.Constants.padding -
        LayoutManager.Constants.padding -
        ContextLayout.height
      )
    };
   
    UIRegistry.main = Controls.draw(UIRegistry.main, ControlsLayout);
    UIRegistry.context = Context.draw(UIRegistry.context, ContextLayout);
    UIRegistry.library = Library.draw(UIRegistry.library, LibraryLayout)
    UIRegistry.minimap = Minimap.draw(UIRegistry.minimap, MinimapLayout);
    UIRegistry.scrub = Scrub.draw(UIRegistry.scrub, ScrubLayout);
    UIRegistry.mixer = Mixer.draw(UIRegistry.mixer, MixerLayout);
    UIRegistry.workspace = Workspace.draw(UIRegistry.workspace, WorkspaceLayout);
  }
};


export default LayoutManager;
