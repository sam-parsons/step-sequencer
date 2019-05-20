import React from "react";
import StepSequence from "./Components/StepSequence";
import Buttons from "./Components/Buttons";
import "./App.css";

function toggleBox(priorChecked, i, row) {
  const checked = [...priorChecked];
  checked[row][i] = !checked[row][i];
  return checked;
}

export default class App extends React.PureComponent {
  state = {
    checked: [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false]
    ],
    isPlaying: false
  };

  onToggleBox = (i, row) => {
    this.setState(prior => ({
      checked: toggleBox(prior.checked, i, row)
    }));
  };

  onTogglePlay = () => {
    this.setState(prior => ({
      isPlaying: !prior.isPlaying
    }));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Buttons
            isPlaying={this.state.isPlaying}
            onTogglePlay={this.onTogglePlay}
          />
          <StepSequence
            checked={this.state.checked}
            onToggle={this.onToggleBox}
          />
        </header>
      </div>
    );
  }
}

// export default App;
