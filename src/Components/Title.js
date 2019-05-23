import React from "react";
import styles from "./Title.module.css";

const Title = () => (
  <div className={styles.root}>
    Step Sequencer
    <div className={styles.info}>
      ©2019{" "}
      <a
        href="https://github.com/sam-parsons/react-step-sequencer"
        className={styles.link}
      >
        Sam Parsons
      </a>
    </div>
  </div>
);

export default Title;
