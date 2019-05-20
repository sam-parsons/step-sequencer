import React from "react";
import PlayButton from "./PlayButton";
import styles from "./Buttons.module.css";

const Buttons = props => (
  <div id="buttons" className={styles.root}>
    <PlayButton isPlaying={props.isPlaying} onTogglePlay={props.onTogglePlay} />
    <PlayButton isPlaying={props.isPlaying} onTogglePlay={props.onTogglePlay} />
    <PlayButton isPlaying={props.isPlaying} onTogglePlay={props.onTogglePlay} />
    <PlayButton isPlaying={props.isPlaying} onTogglePlay={props.onTogglePlay} />
  </div>
);

export default Buttons;
