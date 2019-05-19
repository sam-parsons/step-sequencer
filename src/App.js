import React from "react";
import StepSequence from "./Components/StepSequence";
import "./App.css";

function toggleBox(priorChecked, i) {
  const checked = [...priorChecked];
  checked[i] = !checked[i];
  return checked;
}

export default class App extends React.PureComponent {
  state = {
    checked: [false, true, true, false, false, true, true, false]
  };

  onToggleBox = i => {
    // console.info({ i, value });
    this.setState(prior => ({
      checked: toggleBox(prior.checked, i)
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
