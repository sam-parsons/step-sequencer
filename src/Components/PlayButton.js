import React from "react";
import styles from "./PlayButton.module.css";

const PlayButton = props => (
  <div className={styles.root} onClick={props.onTogglePlay}>
    <span className={styles.label}>{props.isPlaying ? "Stop" : "Play"}</span>
  </div>
);

export default PlayButton;
