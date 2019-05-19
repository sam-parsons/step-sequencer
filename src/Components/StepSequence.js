import React from "react";
import BoxRow from "./BoxRow";

const StepSequence = props => (
  <div id="step-sequence">
    <BoxRow checked={props.checked} onToggle={props.onToggle} />
    <BoxRow checked={props.checked} onToggle={props.onToggle} />
  </div>
);

export default StepSequence;
