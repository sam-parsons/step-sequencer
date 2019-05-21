import _ from "lodash";
import React from "react";
import styles from "./BoxRow.module.css";

const BoxRow = props => (
  <div className={styles.root}>
    {_.map(props.checked[props.row], (isBoxChecked, i) => (
      <div
        onClick={() => {
          props.onToggle(i, props.row);
          console.log(props.checked);
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
