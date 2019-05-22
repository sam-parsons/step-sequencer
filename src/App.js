import React from "react";
import StepSequence from "./Components/StepSequence";
import Buttons from "./Components/Buttons";
import Title from "./Components/Title";
import Tone from "tone";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faStop, faRecycle } from "@fortawesome/free-solid-svg-icons";

/**
 TODO
 - Visualizer
 - Pitch Selection
 - Tap Tempo
 */

function toggleBox(priorChecked, i, row) {
  const checked = [...priorChecked];
  checked[row][i] = !checked[row][i];
  return checked;
}

const synth = new Tone.PolySynth(2, Tone.Synth).toMaster();

library.add(faPlay);
library.add(faStop);
library.add(faRecycle);

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
          //stop transport, turn off looping - prevents collision with measure sequence loop
          Tone.Transport.stop();
          Tone.Transport.loop = false;
          Tone.Transport.loopEnd = 0;
          console.log("stopped");
        } else {
          // configure looping for step sequencer
          Tone.Transport.loop = true;
          Tone.Transport.loopStart = 0;
          Tone.Transport.loopEnd =
            (this.state.sequenceLength * 30) / this.state.tempo;
          Tone.Transport.start("+0.0");
          console.log("playing");
        }
      }
    );
  };

  restartPlaying = () => {
    if (this.state.isPlaying) {
      this.setState({ isPlaying: this.state.isPlaying }, () => {
        Tone.Transport.stop();
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd =
          (this.state.sequenceLength * 30) / this.state.tempo;
        Tone.Transport.loop = true;
        Tone.Transport.start("+0.0");
        console.log("playing restarted");
      });
    } else {
      console.error("restartPlaying called while not playing");
    }
  };

  onLengthChange = sequenceLength => {
    const checked = [[], []];
    for (let i = 0; i < sequenceLength; i++) {
      checked[0].push(i === 0);
      checked[1].push(i !== 0 && i % 2 === 0);
    }
    this.setState(
      () => ({
        sequenceLength,
        checked
      }),
      () => {
        Tone.Transport.loopEnd = (sequenceLength * 30) / this.state.tempo;
        this.generateMetronome();
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
        this.resetTempo();
        this.forceStop();
        this.onLengthChange(this.state.sequenceLength);
      }
    );
  };

  forceStop = () => {
    Tone.Transport.stop();
    Tone.Transport.loop = false;
    Tone.Transport.loopEnd = 0;
    console.log("force stopped");
  };

  resetTempo = () => {
    Tone.Transport.bpm.value = this.state.defaults.tempo;
  };

  handleTap = () => {
    const elapsedTime = Tone.Transport.seconds - this.state.lastTime,
      lastTime = Tone.Transport.seconds,
      tempo = elapsedTime > 2 ? this.state.tempo : Math.round(60 / elapsedTime);
    this.setState({ elapsedTime, tempo, lastTime }, () =>
      this.onTempoChange(tempo)
    );
  };

  generateMetronome = () => {
    // erase or stop all previous parts
    const partContainer = this.state.partContainer;
    partContainer.forEach(part => part.removeAll());

    // metronome vitals
    const [note1, note2] = this.state.notes,
      seqLength = this.state.sequenceLength,
      matrix = this.state.checked;

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
          <Title />
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
