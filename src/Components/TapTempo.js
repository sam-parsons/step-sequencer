import React from "react";
import styles from "./TapTempo.module.css";

const TapTempo = props => (
  <div className={styles.root} onClick={props.handleTap}>
    <span className={styles.label}>Tap</span>
  </div>
);

export default TapTempo;
