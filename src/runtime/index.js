import * as PIXI from 'pixi.js';
import * as BodyScrollLock from 'body-scroll-lock';

// Global
import Events from 'runtime/Events';

// UI
import UIRegistry from 'runtime/UIRegistry';
import LayoutManager from 'runtime/LayoutManager';
import Workspace from 'runtime/ui/Workspace';
import Minimap from 'runtime/ui/Minimap';

// Playback
import Transport from 'runtime/playback/Transport';
import Metronome from 'runtime/playback/Metronome';

// Tracks
// Multiple Timesignatures, tempos etc
//import Zelda from 'mocks/projects/zelda';
import TheWish from 'mocks/projects/theWish';

const Runtime = {
  currentProject: null,

  loadProject(rawProject) {
    const tracksWithNotes = rawProject.tracks.filter(track => track.notes.length);
    const endOfProjectMs = tracksWithNotes.reduce((acc, track) => {
      const lastNote = track.notes[track.notes.length - 1];
      const trackEndsAt = (lastNote.time * 1000 + lastNote.duration * 1000);
      if (trackEndsAt > acc) {
        return trackEndsAt;
      }
      return acc;
    }, 0);

    Runtime.currentProject = {
      raw: rawProject,
      endsAtMs: endOfProjectMs
    };

    Transport.loadProject(Runtime.currentProject);
    LayoutManager.draw(UIRegistry.app);
  },

  start(domNode) {
    BodyScrollLock.disableBodyScroll(domNode);

    Transport.init();
    Metronome.enable();

    const app = new PIXI.Application({ 
      antialias: true,
      resolution: (window.devicePixelRatio || 1),
      autoResize: true
    });
    app.renderer.roundPixels = true;
    domNode.appendChild(app.view);

    UIRegistry.app = app;
    LayoutManager.init(app);

    Events.on('intent.TOGGLE_PLAY', () => {
      Transport.isPlaying ? Transport.pause() : Transport.play();
    });
    Events.on('intent.STOP', () => {
      Transport.stop();
    });
    Events.on('intent.RECORD', () => {
    });
    Events.on('intent.ZOOM_IN', () => {
      Workspace.zoom(UIRegistry.workspace, true);
      Minimap.draw(UIRegistry.minimap);
    });
    Events.on('intent.ZOOM_OUT', () => {
      Workspace.zoom(UIRegistry.workspace, false);
      Minimap.draw(UIRegistry.minimap);
    });
    Events.on('intent.PAN_RIGHT', () => {
      Workspace.pan(UIRegistry.workspace, 'RIGHT');
      Minimap.draw(UIRegistry.minimap);
    });
    Events.on('intent.PAN_LEFT', () => {
      Workspace.pan(UIRegistry.workspace, 'LEFT');
      Minimap.draw(UIRegistry.minimap);
    });

    app.ticker.add(Runtime.tick); 
    // TODO: throttle resizing
    window.addEventListener('resize', Runtime.draw);
    Runtime.draw();

    // MOCK
    Runtime.loadProject(TheWish);
  },

  tick(/*delta*/) {
    Workspace.tick(UIRegistry.workspace);
    Minimap.tick(UIRegistry.minimap);
  },

  drawWorkspace() {
    Workspace.draw(UIRegistry.workspace);
  },

  draw() {
    UIRegistry.app.renderer.resize(window.innerWidth, window.innerHeight);
    LayoutManager.draw(UIRegistry.app);
  }
};

export default Runtime;
