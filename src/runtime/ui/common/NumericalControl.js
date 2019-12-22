import * as PIXI from 'pixi.js';

const NumericalControl = {
  init() {
    const numericalControl = new PIXI.Graphics()
      .beginFill(0xBEBEBE, 1)
      .drawRect(0, 0, 80, 20)
      .endFill();
    numericalControl.name = 'numericalControl';

    const numericalOutputText = new PIXI.Text("100db", {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: "black",
      align: 'right'
    });
    numericalOutputText.anchor.set(0.5, 0.5);
    numericalOutputText.position.set(
      numericalControl.width/2, numericalControl.height/2
    );
    numericalControl.addChild(numericalOutputText);

    return numericalControl;
  }
};

export default NumericalControl;
