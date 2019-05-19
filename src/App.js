import React from "react";
import StepSequence from "./Components/StepSequence";
import "./App.css";

function toggleBox(priorChecked, i, row) {
  const checked = [...priorChecked];
  checked[row][i] = !checked[row][i];
  return checked;
}

export default class App extends React.PureComponent {
  state = {
    checked: [
      [false, true, true, false, false, true, true, false],
      [true, true, false, false, true, true, false, false]
    ]
  };

  onToggleBox = (i, row) => {
    this.setState(prior => ({
      checked: toggleBox(prior.checked, i, row)
    }));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <StepSequence
            checked={this.state.checked}
            onToggle={this.onToggleBox}
          />
        </header>
      </div>
    );
  }
}

// export default App;
