import React from "react";
import PlayButton from "./PlayButton";
import TimeSignature from "./TimeSignature";
import TempoSlider from "./TempoSlider";
import TempoDisplay from "./TempoDisplay";
import TapTempo from "./TapTempo";
import ResetButton from "./ResetButton";
import styles from "./Buttons.module.css";

const Buttons = props => (
  <div id="buttons" className={styles.root}>
    <div className={styles.wrapperTop}>
      <PlayButton
        isPlaying={props.isPlaying}
        onTogglePlay={props.onTogglePlay}
      />
      <TimeSignature
        sequenceLength={props.sequenceLength}
        onLengthChange={props.onLengthChange}
      />
      <ResetButton onReset={props.onReset} />
    </div>
    <div className={styles.wrapperBottom}>
      <TapTempo handleTap={props.handleTap} />
      <TempoDisplay tempo={props.tempo} />
      <TempoSlider tempo={props.tempo} onTempoChange={props.onTempoChange} />
    </div>
  </div>
);

export default Buttons;
