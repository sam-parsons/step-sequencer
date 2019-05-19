import React from "react";
import PlayButton from "./PlayButton";
import styles from "./Buttons.module.css";

const Buttons = props => (
  <div id="buttons" className={styles.root}>
    <PlayButton isPlaying={props.isPlaying} />
    <PlayButton isPlaying={props.isPlaying} />
    <PlayButton isPlaying={props.isPlaying} />
    <PlayButton isPlaying={props.isPlaying} />
  </div>
);

export default Buttons;
