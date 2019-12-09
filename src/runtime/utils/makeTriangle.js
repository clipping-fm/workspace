import * as PIXI from 'pixi.js';

export default (xPos, yPos, width, color) => {
  const triangleWidth = width;
  const triangleHeight = triangleWidth;
  const triangleHalfway = triangleWidth/2;

  const triangle = new PIXI.Graphics();

  triangle.x = xPos;
  triangle.y = yPos;

  triangle.beginFill(0xDE3249, 1);
  triangle.lineStyle(0, 0xDE3249, 1);

  triangle.moveTo(0, triangleHeight);
  triangle.lineTo(triangleWidth, triangleHalfway); 
  triangle.lineTo(0, 0);
  triangle.lineTo(0, triangleHeight);

  triangle.endFill();
  return triangle;
};
