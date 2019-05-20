import React from "react";
import styles from "./TempoSlider.module.css";

const TempoSlider = props => (
  <div className={styles.root}>
    <input
      type="range"
      min="30"
      max="300"
      value={props.tempo}
      onChange={e => {
        props.onTempoChange(e.target.value);
      }}
    />
  </div>
);

export default TempoSlider;
