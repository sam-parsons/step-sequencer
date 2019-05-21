import React from "react";
import styles from "./ResetButton.module.css";

const ResetButton = props => (
  <div className={styles.root} onClick={props.onReset}>
    <span className={styles.label}>Reset</span>
  </div>
);

export default ResetButton;
