import React from "react";
import BoxRow from "./BoxRow";

const StepSequence = props => (
  <div id="step-sequence">
    <BoxRow
      checked={props.checked}
      onToggle={props.onToggle}
      sequenceLength={props.sequenceLength}
      onPitchSelect={props.onPitchSelect}
      notes={props.notes}
      pitchConversion={props.pitchConversion}
      isActive={props.isActive}
      row="0"
    />
    <BoxRow
      checked={props.checked}
      onToggle={props.onToggle}
      sequenceLength={props.sequenceLength}
      onPitchSelect={props.onPitchSelect}
      notes={props.notes}
      isActive={props.isActive}
      row="1"
    />
  </div>
);

export default StepSequence;
