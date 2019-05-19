import _ from "lodash";
import React from "react";
import styles from "./BoxRow.module.css";

const BoxRow = ({ checked, onToggle }) => (
  <div className={styles.root}>
    {_.map(checked, (isBoxChecked, i) => (
      <div
        onClick={() => onToggle(i)}
        className={_.chain([styles.box, isBoxChecked && styles.checked])
          .compact()
          .join(" ")
          .value()}
      />
    ))}
  </div>
);

export default BoxRow;
