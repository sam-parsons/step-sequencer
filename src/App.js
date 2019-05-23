import React from "react";
import StepSequence from "./Components/StepSequence";
import Buttons from "./Components/Buttons";
import Title from "./Components/Title";
import Tone from "tone";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faStop,
  faRecycle,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

/**
 TODO
 - Visualizer - must clear on stop, sometimes gets stuck on highlighted checked square
 - Pitch Selection - prevent same note from being selected twice
 - Tap Tempo - needs better accuracy - multiple previous time average rather than just previous and current
 */

function toggleBox(priorChecked, i, row) {
  const checked = [...priorChecked];
  checked[row][i] = !checked[row][i];
  return checked;
}

const synth = new Tone.PolySynth(2, Tone.Synth).toMaster();
const context = new AudioContext();

library.add(faPlay);
library.add(faStop);
library.add(faRecycle);
library.add(faInfoCircle);

export default class App extends React.PureComponent {
  state = {
    checked: [
      [true, true, false, false, false, false, false],
      [false, false, true, false, true, false, true]
    ],
    isPlaying: false,
    sequenceLength: 7,
    tempo: 120,
    isActive: [[0, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0]],
    renderedNotes: [],
    partContainer: [],
    notes: ["Eb5", "C5"],
    elapsedTime: 0,
    lastTime: 0,
    numberOfTaps: 0,
    averageBPM: 0,
    timeContainer: [],
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
      ],
      notes: ["Eb5", "C5"],
      isActive: [[0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, 0, 1, 0, 1]]
    }
  };

  componentDidMount = () => {
    this.generateMetronome();

    // event listener for space bar
    window.addEventListener("keydown", e => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        try {
          e.preventDefault(); // prevents space bar from triggering selected checkboxes
          this.onTogglePlay();
        } catch (e) {
          console.log(e);
        }
      }
    });

    // this.setState({ timeContainer: [context.currentTime.toFixed(3)] });
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
          // isActive array zeroed out
          this.setState({ isActive: [[], []] }, () => console.log("stopped"));
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
        checked: prior.defaults.checked,
        notes: prior.defaults.notes,
        isActive: prior.defaults.isActive
      }),
      () => {
        this.resetTempo();
        this.forceStop();
        this.onLengthChange(this.state.sequenceLength);
        this.onPitchSelect(this.state.notes[0], 0);
        this.onPitchSelect(this.state.notes[1], 1);
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
    const timeContainer = this.state.timeContainer;

    if (timeContainer.length > 2) timeContainer.shift();
    timeContainer.push(context.currentTime.toFixed(3));
    // average difference between times
    const timeDiffs = [];
    for (let i = 0; i < timeContainer.length - 1; i++) {
      timeDiffs.push(timeContainer[i + 1] - timeContainer[i]);
    }
    const avgTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    const tempo = Math.round(60 / avgTime);
    console.log(tempo);

    if (tempo > 40 && tempo < 301) {
      this.setState({ tempo }, () => this.onTempoChange(tempo));
    }
    // const elapsedTime = Tone.Transport.seconds - this.state.lastTime,
    //   lastTime = Tone.Transport.seconds,
    //   tempo = elapsedTime > 2 ? this.state.tempo : Math.round(60 / elapsedTime);
    // this.setState({ elapsedTime, tempo, lastTime }, () =>
    //   this.onTempoChange(tempo)
    // );
  };

  onPitchSelect = (note, row) => {
    const notes =
      row === "0" ? [note, this.state.notes[1]] : [this.state.notes[0], note]; // fix this conditional
    this.setState({ notes }, () => {
      this.generateMetronome();
    });
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
          note: note1,
          time: `0:${i / 2}`,
          velocity: 0.05,
          index: i
        });
      } else if (!matrix[1][i]) {
        renderedNotes.push({
          note: note1,
          time: `0:${i / 2}`,
          velocity: 0,
          index: i
        });
      }
      if (matrix[1][i]) {
        renderedNotes.push({
          note: note2,
          time: `0:${i / 2}`,
          velocity: 0.05,
          index: i
        });
      }
    }

    // create new Part, start Part, push Part to container
    const part = new Tone.Part((time, value) => {
      this.triggerVisualize(value.index);
      synth.triggerAttackRelease(value.note, 0.05, time, value.velocity);
    }, renderedNotes).start(0);
    partContainer.push(part);

    this.setState({
      renderedNotes,
      partContainer
    });
  };

  triggerVisualize = index => {
    const length = this.state.sequenceLength;
    const isActive = [_.fill(Array(length), 0), _.fill(Array(length), 0)];

    isActive[0][index] = 1;
    isActive[1][index] = 1;
    this.setState({ isActive });
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
            onPitchSelect={this.onPitchSelect}
            notes={this.state.notes}
            isActive={this.state.isActive}
          />
        </header>
      </div>
    );
  }
}
