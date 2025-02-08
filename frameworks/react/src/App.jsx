import { useState, useEffect } from "react";
import Scenario1 from "./test-scenarios/scenario-1/Scenario1";
import Scenario2 from "./test-scenarios/scenario-2/Scenario2";
import Scenario3 from "./test-scenarios/scenario-3/Scenario3";
import Scenario4 from "./test-scenarios/scenario-4/Scenario4";
import Scenario5 from "./test-scenarios/scenario-5/Scenario5";
import "./App.css";

const getScenarioFromURL = () => {
  const hash = window.location.hash;
  if (hash) {
    const scenarioNumber = parseInt(hash.substring(1), 10);
    if (!isNaN(scenarioNumber) && scenarioNumber >= 1 && scenarioNumber <= 5) {
      return scenarioNumber;
    }
  }
  return null;
};

function App() {
  const [testScenario, setTestScenario] = useState(getScenarioFromURL());

  useEffect(() => {
    const handleRouteChange = () => {
      setTestScenario(getScenarioFromURL());
    };

    window.addEventListener("hashchange", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  const setScenarioInURL = (scenario) => {
    if (scenario) {
      window.location.hash = scenario;
    } else {
      window.location.hash = "";
    }
  };

  const getTestComponent = (value) => {
    switch (value) {
      case 1:
        return <Scenario1 />;
      case 2:
        return <Scenario2 />;
      case 3:
        return <Scenario3 />;
      case 4:
        return <Scenario4 />;
      case 5:
        return <Scenario5 />;
      default:
        return null;
    }
  };

  return (
    <>
      {!testScenario ? (
        <div>
          <h4>Select scenario</h4>
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <label>
                  Scenario {i}:{" "}
                  {i === 1
                    ? "Generate and delete components"
                    : i === 2
                    ? "Update components in a flat DOM tree"
                    : i === 3
                    ? "Update components in a deep DOM tree"
                    : i === 4
                    ? "Update components with static content"
                    : "Scenario 5"}
                </label>
                <button
                  id={`btn-scen-${i}`}
                  onClick={() => setScenarioInURL(i)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        getTestComponent(testScenario)
      )}
    </>
  );
}

export default App;
