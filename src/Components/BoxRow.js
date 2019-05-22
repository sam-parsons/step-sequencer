import _ from "lodash";
import React from "react";
import styles from "./BoxRow.module.css";
import PitchSelect from "./PitchSelect";

const BoxRow = props => (
  <div className={styles.root}>
    <PitchSelect
      onPitchSelect={props.onPitchSelect}
      notes={props.notes}
      pitchConversion={props.pitchConversion}
      row={props.row}
    />
    {_.map(props.checked[props.row], (isBoxChecked, i) => (
      <div
        onClick={() => {
          props.onToggle(i, props.row);
        }}
        className={_.chain([styles.box, isBoxChecked && styles.checked])
          .compact()
          .join(" ")
          .value()}
        key={i}
      />
    ))}
  </div>
);

export default BoxRow;
