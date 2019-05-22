import React from "react";
import styles from "./PitchSelect.module.css";

const PitchSelect = props => (
  <div className={styles.root}>
    <label htmlFor="note">{props.notes[props.row]}</label>
    <input
      className={styles.input}
      type="number"
      name="note"
      min="0"
      max="12"
      step="1"
      defaultValue={props.pitchConversion.indexOf(props.notes[props.row])}
      onChange={e => {
        props.onPitchSelect(e.target.value, props.row);
      }}
    />
  </div>
);

export default PitchSelect;
