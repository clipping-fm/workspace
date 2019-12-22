import * as PIXI from 'pixi.js';
import { initBackground, drawBackground } from 'runtime/ui/common/hasBackground';

import Runtime from 'runtime';
import Transport from 'runtime/playback/Transport';
import Workspace from 'runtime/ui/Workspace';

let DRAG_DATA = null;

function onWindowHandleDragStart(event) {
  DRAG_DATA = {
    xOriginal: event.data.getLocalPosition(this.parent).x,
    yOriginal: event.data.getLocalPosition(this.parent).y,
    xDelta: 0,
    yDelta: 0,
    originalWorkspacePositionMs: Workspace.viewportLeftPositionMs,
    event
  };
};

function onWindowHandleMove() {
  if (!DRAG_DATA) return;

  if (DRAG_DATA.event.data.getLocalPosition(this.parent).x > window.innerWidth) 
    return onWindowHandleDragEnd();
  if (DRAG_DATA.event.data.getLocalPosition(this.parent).x < 0)
    return onWindowHandleDragEnd();

  DRAG_DATA = {
    ...DRAG_DATA,
    xDelta: DRAG_DATA.event.data.getLocalPosition(this.parent).x - DRAG_DATA.xOriginal,
    yDelta: DRAG_DATA.event.data.getLocalPosition(this.parent).y - DRAG_DATA.yOriginal
  };

  this.x = 
    Workspace.viewportLeftPositionMs <= 0 ? 
    0 :
    (Workspace.viewportLeftPositionMs / Workspace.projectWidthMs) * window.innerWidth;

  const distanceMovedInMs = (DRAG_DATA.xDelta / window.innerWidth) * Workspace.projectWidthMs;
  Workspace.viewportLeftPositionMs = Math.max(0, DRAG_DATA.originalWorkspacePositionMs + distanceMovedInMs);

  // Here, we just draw the workspace, so that the windowHandle doesn't get recycled
  // We'll redraw the whole runtime when the mouse is let up
  Runtime.drawWorkspace();
};
 
function onWindowHandleDragEnd() {
  if (DRAG_DATA) {
    const distanceMovedInMs = (DRAG_DATA.xDelta / window.innerWidth) * Workspace.projectWidthMs;
    Workspace.viewportLeftPositionMs = Math.max(0, DRAG_DATA.originalWorkspacePositionMs + distanceMovedInMs);
    Runtime.draw();
    DRAG_DATA = null;
  }
};

const Minimap = {
  Constants: {
    HEIGHT: 56,
    windowHandleWidth: 4
  },

  init(app, layout) {
    const self = new PIXI.Container();
    initBackground(self, layout);
    Minimap.draw(self, layout);
    return self;
  },

  makeTracks(self) {
    self.children.filter(c => c.name === 'track').map(c => self.removeChild(c));
    if (Runtime.currentProject) {
      
      const tracks = Runtime.currentProject.raw.tracks;
      tracks.forEach(track => {
        track.parts.forEach(part => {
          part.instances.forEach(instance => {
            const lastNote = part.notes[part.notes.length - 1];
            const endOfPartMs = (lastNote.time * 1000 + lastNote.duration * 1000);
            const heightOfTrack = 2;

            const partContainer = new PIXI.Graphics()
              .beginFill(0xff0000, 1)
              .drawRect(
                0,
                Minimap.Constants.windowHandleWidth + (tracks.indexOf(track) * heightOfTrack),
                (endOfPartMs / Workspace.projectWidthMs) * self.width,
                heightOfTrack
              )
              .endFill();
            partContainer.name = 'partContainer';

            partContainer.x = instance.time * 1000 / Workspace.pxToMs;
            self.addChild(partContainer);
          });
        });
      });
    }
  },

  makeWindowHandle(self) {
    self.removeChild(self.getChildByName('windowHandle'));

    const windowHandle = new PIXI.Graphics()
      .beginFill(0x000000, 0.1)
      .lineStyle(Minimap.Constants.windowHandleWidth, 0xBEBEBE, 1, 0)
      .drawRect(
        0, 
        0, 
        (Workspace.viewportWidthMs / Workspace.projectWidthMs) * self.width,
        self.height
      )
      .endFill();
    windowHandle.name = 'windowHandle';

    windowHandle.interactive = true;
    windowHandle.buttonMode = true;

    windowHandle
      .on('pointerup', onWindowHandleDragEnd)
      .on('pointerdown', onWindowHandleDragStart)
      .on('pointerupoutside', onWindowHandleDragEnd)
      .on('pointermove', onWindowHandleMove)

    windowHandle.x = 
      Workspace.viewportLeftPositionMs <= 0 ? 
      0 :
      (Workspace.viewportLeftPositionMs / Workspace.projectWidthMs) * self.width;

    self.addChild(windowHandle);
  },

  makeProgressBar(self) {
    self.removeChild(self.getChildByName('progressBar'));
    const progressBar = new PIXI.Graphics()
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, 1, self.height)
      .endFill();
    progressBar.name = 'progressBar';
    self.addChild(progressBar);
  },

  loadProject(self, app) {
    Minimap.draw(self, app);
  },

  tick(self) {
    const progressBar = self.getChildByName('progressBar');
    if (!progressBar) return;
    progressBar.x = (Transport.position / Workspace.projectWidthMs) * self.width;
  },

  draw(self, layout) {
    if (!self) return;
    if (layout) drawBackground(self, layout);
    Minimap.makeTracks(self);
    Minimap.makeProgressBar(self);
    Minimap.makeWindowHandle(self);
    return self;
  }
};

export default Minimap;
