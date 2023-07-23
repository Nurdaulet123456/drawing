import { useState } from "react";

import useDraw from "@/hooks/useDraw";
import { ChromePicker } from "react-color";

const HomePage = () => {
  const [colorPicker, setColorPicker] = useState<string>("#000");
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(5);

  const toggleEraser = () => {
    setIsErasing((prevState) => !prevState);
  };

  const { canvasRef, onMouseDown, clearPicker, handleTurnOffOrTurnOn, turn } =
    useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;

    const color = colorPicker;

    const lineWidth = isErasing ? strokeWidth : 5;

    let startPoint = prevPoint ?? currentPoint;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isErasing ? "#FFFFFF" : color;

    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);

    ctx.stroke();

    ctx.fillStyle = isErasing ? "#FFFFFF" : color;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <>
      <div className="canvas">
        <div className="canvas_color_picker">
          <ChromePicker
            color={colorPicker}
            onChange={(e) => setColorPicker(e.hex)}
          />
          <button
            className="btn"
            onClick={clearPicker}
            style={{ backgroundColor: colorPicker }}
          >
            Очистить
          </button>
          <button
            className="btn"
            onClick={toggleEraser}
            style={{ backgroundColor: colorPicker }}
          >
            {!isErasing ? "Рисовать" : "Ластик"}
          </button>

          <button
            className="btn"
            style={{ backgroundColor: colorPicker }}
            onClick={handleTurnOffOrTurnOn}
          >
            Палитра: {turn ? 'Вкл' : 'Выкл'}
          </button>

          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
          <span>Толщина ластика: {strokeWidth}</span>
        </div>
        <canvas
          onMouseDown={onMouseDown}
          ref={canvasRef}
          className="canvas_inner"
          width={750}
          height={750}
        />
      </div>
    </>
  );
};

export default HomePage;
