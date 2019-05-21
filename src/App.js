import React from "react";
import StepSequence from "./Components/StepSequence";
import Buttons from "./Components/Buttons";
import Tone from "tone";
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
    tempo: 120,
    elapsedTime: 0,
    lastTime: 0,
    numberOfTaps: 0,
    averageBPM: 0,
    defaults: {
      tempo: 120,
      sequenceLength: 8,
      isPlaying: false,
      elapsedTime: 0,
      numberOfTaps: 0,
      averageBPM: 0
    }
  };

  componentDidMount = () => {
    Tone.Transport.start();
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
    this.setState({
      tempo
    });
  };

  onReset = () => {
    this.setState(
      prior => ({
        tempo: prior.defaults.tempo,
        sequenceLength: prior.defaults.sequenceLength,
        isPlaying: prior.defaults.isPlaying
      }),
      () => this.onLengthChange(this.state.sequenceLength)
    );
  };

  handleTap = () => {
    const elapsedTime = Tone.Transport.seconds - this.state.lastTime;
    const lastTime = Tone.Transport.seconds;
    const tempo =
      elapsedTime > 2 ? this.state.tempo : Math.round(60 / elapsedTime);
    this.setState({ elapsedTime, tempo, lastTime });
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
            onReset={this.onReset}
            handleTap={this.handleTap}
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
