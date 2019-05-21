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

const synth = new Tone.PolySynth(2, Tone.Synth).toMaster();

export default class App extends React.PureComponent {
  state = {
    checked: [
      [true, true, false, false, false, false, false],
      [false, false, true, false, true, false, true]
    ],
    isPlaying: false,
    sequenceLength: 7,
    tempo: 120,
    renderedNotes: [],
    partContainer: [],
    notes: ["C5", "Eb5"],
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
      averageBPM: 0,
      checked: [
        [true, false, false, false, false, false, false, false],
        [false, false, true, false, true, false, true, false]
      ]
    }
  };

  componentDidMount = () => {
    Tone.Transport.start();

    this.generateMetronome();
  };

  onToggleBox = (i, row) => {
    this.setState(
      prior => ({
        checked: toggleBox(prior.checked, i, row)
      }),
      () => {
        this.generateMetronome();
      }
    );
  };

  onTogglePlay = () => {
    this.setState(
      prior => ({
        isPlaying: !prior.isPlaying
      }),
      () => {
        if (!this.state.isPlaying) {
          //stop transport
          Tone.Transport.stop();
          console.log("playing stopped");

          // turn off looping - prevents collision with measure sequence loop
          Tone.Transport.loop = false;
          Tone.Transport.loopEnd = 0;
        } else {
          // configure looping for step sequencer
          Tone.Transport.loop = true;
          Tone.Transport.loopStart = 0;
          Tone.Transport.loopEnd =
            (this.state.sequenceLength * 30) / this.state.tempo; // magic equation

          // start transport after loop config
          Tone.Transport.start("+0.0");
          console.log("playing initiated");
        }
      }
    );
  };

  restartPlaying() {
    if (this.state.isPlaying) {
      this.setState({ isPlaying: this.state.isPlaying }, () => {
        //stop transport
        Tone.Transport.stop();

        // configure looping for step sequencer
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd =
          (this.state.sequenceLength * 30) / this.state.tempo; // magic equation
        Tone.Transport.loop = true;

        // start transport after loop config
        Tone.Transport.start("+0.0");
        console.log("playing restarted");
      });
    } else {
      console.error("restartPlaying called while not playing");
    }
  }

  onLengthChange = sequenceLength => {
    const checked = [[], []];
    for (let i = 0; i < sequenceLength; i++) {
      checked[0].push(false);
      checked[1].push(false);
    }
    this.setState(
      () => ({
        sequenceLength,
        checked
      }),
      () => {
        this.generateMetronome();
        this.onTogglePlay();
      }
    );
  };

  onTempoChange = tempo => {
    this.setState(
      {
        tempo
      },
      () => {
        Tone.Transport.bpm.value = tempo;
      }
    );
  };

  onReset = () => {
    this.setState(
      prior => ({
        tempo: prior.defaults.tempo,
        sequenceLength: prior.defaults.sequenceLength,
        isPlaying: prior.defaults.isPlaying,
        checked: prior.defaults.checked
      }),
      () => {
        this.onLengthChange(this.state.sequenceLength);
        this.generateMetronome();
      }
    );
  };

  handleTap = () => {
    const elapsedTime = Tone.Transport.seconds - this.state.lastTime;
    const lastTime = Tone.Transport.seconds;
    const tempo =
      elapsedTime > 2 ? this.state.tempo : Math.round(60 / elapsedTime);
    this.setState({ elapsedTime, tempo, lastTime }, () =>
      this.onTempoChange(tempo)
    );
  };

  generateMetronome = () => {
    // erase or stop all previous parts
    const partContainer = this.state.partContainer;
    partContainer.forEach(part => part.removeAll());

    // metronome vitals
    const [note1, note2] = this.state.notes;
    const seqLength = this.state.sequenceLength;
    const matrix = this.state.checked;
    const tempo = this.state.tempo;

    // new renderedNotes array, populate
    const renderedNotes = [];
    for (let i = 0; i < seqLength; i++) {
      if (matrix[0][i]) {
        renderedNotes.push({
          note: note2,
          time: `0:${i / 2}`,
          velocity: 0.05
        });
      } else if (!matrix[1][i]) {
        renderedNotes.push({
          note: note2,
          time: `0:${i / 2}`,
          velocity: 0
        });
      }
      if (matrix[1][i]) {
        renderedNotes.push({
          note: note1,
          time: `0:${i / 2}`,
          velocity: 0.05
        });
      }
    }
    console.log(renderedNotes);

    // create new Part, start Part, push Part to container
    const part = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.note, 0.05, time, value.velocity);
    }, renderedNotes).start(0);
    partContainer.push(part);

    this.setState({
      renderedNotes,
      partContainer
    });
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
