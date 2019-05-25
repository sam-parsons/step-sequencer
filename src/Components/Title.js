import React from "react";
import _ from "lodash";
import styles from "./Title.module.css";

const Title = props => (
  <div
    className={_.chain([styles.root, props.landscape && styles.landscape])
      .compact()
      .join(" ")
      .value()}
  >
    Step Sequencer
  </div>
);

export default Title;
