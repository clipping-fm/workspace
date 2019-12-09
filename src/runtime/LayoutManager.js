import UIRegistry from 'runtime/UIRegistry';

import Workspace from 'runtime/ui/Workspace';
import Minimap from 'runtime/ui/Minimap';
import Context from 'runtime/ui/Context';
import Library from 'runtime/ui/Library';
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
    UIRegistry.main = Controls.init(ControlsLayout);
    app.stage.addChild(UIRegistry.main);

    /* Context is the bottom bar */
    const ContextLayout = { 
      x: 0,
      y: app.screen.height - Context.Constants.HEIGHT,
      width: app.screen.width,
      height: Context.Constants.HEIGHT
    };

    UIRegistry.context = Context.init(ContextLayout);
    app.stage.addChild(UIRegistry.context);

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
    
    UIRegistry.library = Library.init(LibraryLayout);
    app.stage.addChild(UIRegistry.library);

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
    UIRegistry.minimap = Minimap.init(app, MinimapLayout);
    app.stage.addChild(UIRegistry.minimap);

    // TODO: Scrub Bar
  
    const WorkspaceLayout = {
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
    UIRegistry.main = Controls.draw(UIRegistry.main, ControlsLayout);

    const ContextLayout = { 
      x: 0,
      y: app.screen.height - Context.Constants.HEIGHT,
      width: app.screen.width,
      height: Context.Constants.HEIGHT
    };
    UIRegistry.context = Context.draw(UIRegistry.context, ContextLayout);

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
    UIRegistry.library = Library.draw(UIRegistry.library, LibraryLayout)

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
    UIRegistry.minimap = Minimap.draw(UIRegistry.minimap, MinimapLayout);

    // TODO: Scrub Bar

    const WorkspaceLayout = {
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
    UIRegistry.workspace = Workspace.draw(UIRegistry.workspace, WorkspaceLayout);
  }
};


export default LayoutManager;
