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
    isPlaying: false,
    sequenceLength: 8,
    tempo: 120
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

  onLengthChange = sequenceLength => {
    const checked = [[], []];
    for (let i = 0; i < sequenceLength; i++) {
      checked[0].push(false);
      checked[1].push(false);
    }
    this.setState(() => ({
      sequenceLength,
      checked
    }));
  };

  onTempoChange = tempo => {
    this.setState(
      {
        tempo
      },
      () => console.log(tempo)
    );
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Buttons
            isPlaying={this.state.isPlaying}
            onTogglePlay={this.onTogglePlay}
            sequenceLength={this.state.sequenceLength}
            onLengthChange={this.onLengthChange}
            tempo={this.state.tempo}
            onTempoChange={this.onTempoChange}
          />
          <StepSequence
            checked={this.state.checked}
            onToggle={this.onToggleBox}
            sequenceLength={this.state.sequenceLength}
          />
        </header>
      </div>
    );
  }
}

// export default App;
