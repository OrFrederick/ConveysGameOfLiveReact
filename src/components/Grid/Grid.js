import React, { useState, useEffect, useRef } from 'react';
import Cell from '../Cell/Cell';
import './grid.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const Grid = (props) => {
  const [cells, setCells] = useState([]);
  const [editedCells, setEditedCells] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const gameRunningRef = useRef(gameRunning);
  const speedRef = useRef(props.speed);
  gameRunningRef.current = gameRunning;
  speedRef.current = props.speed;

  useEffect(() => {
    const createGrid = () => {
      const createCell = (x, y) => {
        return {
          key: x + '' + y,
          x: x,
          y: y,
          dead: true,
        };
      };

      let g = [];
      for (let x = 0; x < 50; x++) {
        let tmp = [];
        for (let y = 0; y < 50; y++) {
          console.log('jd');
          tmp.push(createCell(x, y));
        }
        g.push(tmp);
      }
      return g;
    };

    setCells(createGrid());
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }, []);

  // Returns the number of living neighbours of a given cell at (x,y)
  const numberOfLivingNeighbours = (x, y) => {
    let alive = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j === 0)) {
          if (
            0 <= x + i &&
            x + i < cells.length &&
            0 <= y + j &&
            y + j < cells[x + i].length
          ) {
            if (!cells[x + i][y + j].dead) {
              alive++;
            }
          }
        }
      }
    }
    return alive;
  };

  // function to update the game by one step with the rules of Conway's Game of Life
  const updateGameGrid = () => {
    let changes = [];
    for (let x = 0; x < cells.length; x++) {
      for (let y = 0; y < cells[x].length; y++) {
        let cell = cells[x][y];
        if (cell.dead && numberOfLivingNeighbours(x, y) === 3) {
          changes.push([x, y, false]);
        } else if (
          !cell.dead &&
          (numberOfLivingNeighbours(x, y) < 2 ||
            numberOfLivingNeighbours(x, y) > 3)
        ) {
          changes.push([x, y, true]);
        }
      }
    }
    let tmp = cells.slice();

    for (let i in changes) {
      let state = changes[i];
      tmp[state[0]][state[1]].dead = state[2];
    }
    setCells(tmp);
    return tmp;
  };

  const isArrayInArray = (arr, item) => {
    var item_as_string = JSON.stringify(item);

    var contains = arr.some(function (ele) {
      return JSON.stringify(ele) === item_as_string;
    });
    return contains;
  };

  // Converts the 2D array of cells into a 1D array of booleans (dead or not)
  const convertBoard = (board) => {
    let newBoard = [];
    for (let row in board) {
      for (let col in board[row]) {
        newBoard.push(board[row][col].dead);
      }
    }
    return newBoard;
  };

  const runGame = (pastBoards) => {
    if (gameRunningRef.current) {
      let curBoard = convertBoard(updateGameGrid());

      // If we are in a loop, stop
      if (isArrayInArray(pastBoards, curBoard)) {
        gameRunningRef.current = false;
        setGameRunning(false);
      }
      pastBoards.unshift(curBoard);

      // With this check, we ensure that the history of boards is max. 10 boards long
      if (pastBoards.length === 11) {
        pastBoards.pop(0);
      }
      setTimeout(() => runGame(pastBoards), 1000 / speedRef.current);
    }
  };

  const handleClick = (x, y) => {
    toggleCell(x, y);
  };

  const handleMouseMove = (x, y) => {
    if (mouseDown) {
      toggleCell(x, y);
    }
  };

  const toggleCell = (x, y) => {
    if (!props.moveMode && !isArrayInArray(editedCells, [x, y])) {
      let tmp = cells.slice();
      tmp[x][y].dead = !tmp[x][y].dead;
      setCells(tmp);
      setEditedCells([...editedCells, [x, y]]);
    }
  };

  return (
    <div
      className="grid"
      onMouseDown={(e) => {
        e.preventDefault();
        setMouseDown(true);
      }}
      onMouseUp={() => {
        setEditedCells([]);
        setMouseDown(false);
      }}
      onMouseLeave={() => {
        setEditedCells([]);
        setMouseDown(false);
      }}
    >
      <TransformWrapper
        wheel={{ disabled: !props.moveMode }}
        panning={{ disabled: !props.moveMode }}
      >
        <TransformComponent>
          <table className="grid-table">
            <tbody>
              {cells.map((cols, col) => (
                <tr key={col} className="row">
                  {cols.map((c) => (
                    <Cell
                      key={c.key}
                      keyVal={c.key}
                      x={c.x}
                      y={c.y}
                      dead={c.dead}
                      mouseDown={mouseDown}
                      moveMode={props.moveMode}
                      handleClick={handleClick}
                      handleMouseMove={handleMouseMove}
                    ></Cell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TransformComponent>
      </TransformWrapper>
      <button
        onClick={() => {
          if (gameRunningRef.current) {
            setGameRunning(false);
            gameRunningRef.current = false;
          } else {
            setGameRunning(true);
            gameRunningRef.current = true;
            setTimeout(() => runGame([]), 1000 / speedRef.current);
          }
        }}
      >
        {gameRunning ? 'STOP' : 'START'}
      </button>
    </div>
  );
};

export default Grid;
