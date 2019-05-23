import React from "react";
import styles from "./TimeSignature.module.css";

const TimeSignature = props => (
  <div className={styles.root}>
    <select
      name="length"
      id="row-length"
      className={styles.length}
      value={props.sequenceLength}
      onChange={e => {
        props.onLengthChange(e.target.value);
      }}
    >
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
    </select>
  </div>
);

export default TimeSignature;
