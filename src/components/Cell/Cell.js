import './cell.css';

const Cell = (props) => {
  return (
    <td
      key={props.keyVal}
      className={'cell ' + (props.dead ? 'dead' : 'alive')}
      onClick={() => props.handleClick(props.x, props.y)}
      // onMouseMove
      onMouseEnter={() => {
        props.handleMouseMove(props.x, props.y);
      }}
    ></td>
  );
};
export default Cell;
