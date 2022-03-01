import './App.css';
import Grid from './components/Grid/Grid';
import { useState } from 'react';
import Options from './components/Options/Options';

function App() {
  const [moveMode, setMoveMode] = useState(false);
  const [speed, setSpeed] = useState(10);

  const changeOption = (v) => {
    setMoveMode(v);
  };

  return (
    <div className="App">
      <h1>Das Spiel des Lebens</h1>
      <Grid moveMode={moveMode} speed={speed}></Grid>
      <Options
        speed={speed}
        handleSpeed={setSpeed}
        moveMode={moveMode}
        changeOption={changeOption}
      ></Options>
    </div>
  );
}

export default App;
