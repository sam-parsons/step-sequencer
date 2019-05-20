import React from "react";
import PlayButton from "./PlayButton";
import TimeSignature from "./TimeSignature";
import TempoSlider from "./TempoSlider";
import styles from "./Buttons.module.css";

const Buttons = props => (
  <div id="buttons" className={styles.root}>
    <PlayButton isPlaying={props.isPlaying} onTogglePlay={props.onTogglePlay} />
    <TimeSignature
      sequenceLength={props.sequenceLength}
      onLengthChange={props.onLengthChange}
    />
    <TempoSlider tempo={props.tempo} onTempoChange={props.onTempoChange} />
  </div>
);

export default Buttons;
