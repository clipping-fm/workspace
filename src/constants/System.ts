const System: any = {
  ui: {
    trackHeight: 140,
    trackHeaderHeight: 20,
  },
};

System.ui.noteContainerHeight =
  System.ui.trackHeight - System.ui.trackHeaderHeight;

export default System;
