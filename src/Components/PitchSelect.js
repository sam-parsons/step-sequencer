import React from "react";
import styles from "./PitchSelect.module.css";

const PitchSelect = props => (
  <div className={styles.root}>
    <select
      name="pitch"
      id="pitch"
      className={styles.select}
      value={props.notes[props.row]}
      onChange={e => {
        props.onPitchSelect(e.target.value, props.row);
      }}
    >
      <option value="G5">G5</option>
      <option value="Gb5">Gb5</option>
      <option value="F5">F5</option>
      <option value="E5">E5</option>
      <option value="Eb5">Eb5</option>
      <option value="D5">D5</option>
      <option value="Db5">Db5</option>
      <option value="C5">C5</option>
      <option value="B4">B4</option>
      <option value="Bb4">Bb4</option>
      <option value="A4">A4</option>
      <option value="Ab4">Ab4</option>
      <option value="G4">G4</option>
    </select>
  </div>
);

export default PitchSelect;
