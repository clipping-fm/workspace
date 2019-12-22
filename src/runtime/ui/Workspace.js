import * as PIXI from 'pixi.js';
import { 
  initBackground, 
  drawBackground, 
  getBackground 
} from 'runtime/ui/common/hasBackground';
import GlobalConstants from 'runtime/ui/common/GlobalConstants';

import times from 'runtime/utils/times';
import remap from 'runtime/utils/remap';

import Runtime from 'runtime';
import Transport from 'runtime/playback/Transport';

const Constants = {
  TRACK_HEADER_HEIGHT: 20
};

const Workspace = {
  viewportLeftPositionMs: 0,
  viewportWidthMs: 30000,
  pxToMs: 0,

  init(app, layout) {
    const self = new PIXI.Container();
    initBackground(self, layout, 0xff00000);
    return self;
  },

  get widthOfOneBarMs() {
    return Transport.beatEvery * Transport.timeSignature;
  },

  get widthOfOneBarPx() {
    return Workspace.widthOfOneBarMs / Workspace.pxToMs;
  },

  get projectWidthMs() {
    if (Runtime.currentProject) {
      return Math.max(
        Runtime.currentProject.endsAtMs, 
        Workspace.viewportLeftPositionMs + Workspace.viewportWidthMs
      );
    } else {
      return Workspace.viewportLeftPositionMs + Workspace.viewportWidthMs;
    }
  },

  makeGridLines(workspaceInner) {
    workspaceInner.children.filter(c => c.name === 'gridLine').map(c => workspaceInner.removeChild(c));
    // TODO: Major bars should be darker
    times(Math.max(workspaceInner.width, workspaceInner.parent.width)/Workspace.widthOfOneBarPx, i => {
      const gridLine = new PIXI.Graphics()
        .beginFill(0x444444, 1)
        .drawRect(i * Workspace.widthOfOneBarPx, 0, 1, Math.max(workspaceInner.height, workspaceInner.parent.height))
        .endFill();
      gridLine.name = 'gridLine';
      workspaceInner.addChild(gridLine);
    });
  },

  makeProgressBar(workspaceInner) {
    workspaceInner.removeChild(workspaceInner.getChildByName('progressBar'));
    const progressBar = new PIXI.Graphics()
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, 1, Math.max(workspaceInner.height, workspaceInner.parent.height))
      .endFill();
    progressBar.name = 'progressBar';
    // TODO
    //progressBar.x = remap(Transport.position, 0, Workspace.viewportWidthMs, 0, self.width);
    workspaceInner.addChild(progressBar);
  },

  loadProject(self) {
    Workspace.draw(self);
  },

  makeWorkspaceInner(self) {
    let workspaceInner = self.getChildByName('workspaceInner');
    if (!workspaceInner) {
      workspaceInner = new PIXI.Container();
      workspaceInner.name = 'workspaceInner';
      self.addChild(workspaceInner);
    }
    return workspaceInner;
  },

  makeTracks(workspaceInner) {
    // Remove old tracks
    workspaceInner 
      .children
      .filter(c => c.name === 'track')
      .map(c => workspaceInner.removeChild(c));

    // Make them
    if (Runtime.currentProject) {
      Runtime.currentProject.raw.tracks.forEach(track => {
        const trackContainer = new PIXI.Graphics()
          .beginFill(0x444444, 1)
          .drawRect(0, 0, 0, GlobalConstants.EXPANDED_TRACK_HEIGHT)
          .endFill();
        trackContainer.name = 'track';

        track.parts.forEach(part => {

          part.instances.forEach(instance => {
            const lastNote = part.notes[part.notes.length - 1];
            const endOfPartMs = (lastNote.time * 1000 + lastNote.duration * 1000);
            const partWidthPx = endOfPartMs / Workspace.pxToMs;

            const partContainer = new PIXI.Graphics()
              .beginFill(0x444444, 1)
              .drawRect(0, 0, partWidthPx, trackContainer.height)
              .endFill();
            partContainer.name = 'part';

            const partHeader = new PIXI.Graphics()
              .beginFill(0xffffff, 1)
              .drawRect(0, 0, partWidthPx, Constants.TRACK_HEADER_HEIGHT)
              .endFill();
            partHeader.name = 'partHeader';
            partContainer.addChild(partHeader);

            const noteRange = part.notes.reduce((acc, n) => {
              if (acc.highest === null && acc.lowest === null) {
                return { highest: n.midi, lowest: n.midi };
              };
              const newAcc = { ...acc };
              if (n.midi > acc.highest) newAcc.highest = n.midi;
              if (n.midi < acc.lowest) newAcc.lowest = n.midi;
              return newAcc;
            }, { highest: null, lowest: null });

            const rangeClicks = noteRange.highest - noteRange.lowest;

            // TODO: handle largest and smallest note heights
            let noteHeight = Math.floor((partContainer.height - partHeader.height)/rangeClicks);

            part.notes.forEach(n => {
              const position = remap(n.midi, noteRange.lowest, noteRange.highest, rangeClicks, 0);
              const note = new PIXI.Graphics()
                .beginFill(0xff0000, 1)
                .drawRect(
                  (n.time * 1000)/Workspace.pxToMs, 
                  partContainer.y + (position * noteHeight) + partHeader.height,
                  (n.duration * 1000)/Workspace.pxToMs, 
                  noteHeight
                )
                .endFill();
              note.name = 'note';
              partContainer.addChild(note);
            });

            partContainer.x = instance.time * 1000 / Workspace.pxToMs;
            trackContainer.addChild(partContainer);
          });
        });

        const runningHeight = 
          workspaceInner.children
            .filter(c => c.name === 'track')
            .reduce((totalHeight, track) => {
              return totalHeight + track.height
            }, 0);
        trackContainer.y = runningHeight;
        workspaceInner.addChild(trackContainer);
      });
    }

    return workspaceInner;
  },

  zoom(self, zoomIn = true) {
    if (zoomIn) {
      Workspace.viewportWidthMs = Workspace.viewportWidthMs / 2;
    } else {
      Workspace.viewportWidthMs = Workspace.viewportWidthMs * 2;
    }
    Workspace.draw(self);
  },

  pan(self, direction = 'RIGHT') {
    if (direction === 'RIGHT') {
      Workspace.viewportLeftPositionMs = 
        Workspace.viewportLeftPositionMs + Workspace.widthOfOneBarMs;
    } else if (direction === 'LEFT') {
      Workspace.viewportLeftPositionMs = 
        Math.max(Workspace.viewportLeftPositionMs - Workspace.widthOfOneBarMs, 0);
    }

    const workspaceInner = Workspace.makeWorkspaceInner(self);
    workspaceInner.x = (
      -1 * 
      (Workspace.viewportLeftPositionMs / Workspace.pxToMs)
    );
  },

  tick(self) {
    const workspaceInner = self.getChildByName('workspaceInner');
    const progressBar = workspaceInner.getChildByName('progressBar');
    if (!progressBar) return;
    progressBar.x = Transport.position / Workspace.pxToMs;
  },

  draw(self, layout) {
    if (layout) drawBackground(self, layout);
    const background = getBackground(self);
    Workspace.pxToMs = Workspace.viewportWidthMs / background.width;

    const workspaceInner = Workspace.makeWorkspaceInner(self);
    Workspace.makeTracks(workspaceInner);
    Workspace.makeGridLines(workspaceInner);
    Workspace.makeProgressBar(workspaceInner);

    workspaceInner.x = (
      -1 * 
      (Workspace.viewportLeftPositionMs / Workspace.pxToMs)
    );

    return self;
  }
};

export default Workspace;
