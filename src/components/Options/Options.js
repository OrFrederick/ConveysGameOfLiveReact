// mode is either moving or "drawing"
const Options = (props) => {
  return (
    <div>
      <div className="select-mode">
        <div className="radio">
          <label>
            <input
              type="radio"
              value="draw-mode"
              checked={!props.moveMode}
              onChange={() => props.changeOption(false)}
            />
            Draw
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="move-mode"
              checked={props.moveMode}
              onChange={() => props.changeOption(true)}
            />
            Move
          </label>
        </div>
      </div>
      <label htmlFor="speed">Geschwindigkeit</label>
      <input
        type="range"
        id="speed"
        name="speed"
        min="1"
        max="100"
        value={props.speed}
        step="1"
        onChange={(e) => props.handleSpeed(e.target.value)}
      />
    </div>
  );
};

export default Options;
