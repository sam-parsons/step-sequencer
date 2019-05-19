import React from "react";
import styles from "./PlayButton.module.css";

const PlayButton = props => (
  <div className={styles.root}>
    {/* {props.isPlaying ? (
      <span className={styles.symbol} role="img">
        &#9658;
      </span>
    ) : (
      <span className={styles.symbol} role="img">
        &#9726;
      </span>
    )} */}
  </div>
);

export default PlayButton;
