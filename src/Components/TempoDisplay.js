import React from "react";
import styles from "./TempoDisplay.module.css";

const TempoDisplay = props => (
  <div className={styles.root}>
    <span className={styles.label}>{props.tempo}</span>
  </div>
);

export default TempoDisplay;
