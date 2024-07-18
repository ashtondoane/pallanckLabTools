import * as React from "react";
import { FlySetContext, VialDataContext } from "../App";
import { VialData } from "../App";
import * as DataHandler from "../dataTools/DataHandling";
import { Spinner } from "@cloudscape-design/components";
import { Button } from "@cloudscape-design/components";

function StatReviewPage() {
  const [vialData, setVialData] = React.useContext(VialDataContext);
  const [trialData, setTrialData] = React.useState<VialData[]>([]);

  const summarizeSets = (data: VialData[]) => {
    const setNames = [];
    for (var vial of data) {
      if (setNames.indexOf(vial.label) == -1) {
        setNames.push(vial.label);
      }
    }
    const result: VialData[] = [];
    for (var name of setNames) {
      const temp: VialData = {
        label: name,
        n: 0,
        numFlies: 0,
        src: "",
        rawData: [],
      };
      for (var vial of data) {
        if (vial.label == name) {
          temp.n += 1;
          temp.numFlies = (temp.numFlies || 0) + (vial.numFlies || 0);
          temp.rawData = [...temp.rawData, ...vial.rawData];
          console.log(temp.rawData);
        }
      }
      temp.meanHeight = DataHandler.getMean(temp.rawData);
      temp.max = DataHandler.getMaxHeight(temp.rawData);
      temp.min = DataHandler.getMinHeight(temp.rawData);
      temp.stdDev = DataHandler.getStdDev(temp.rawData);
      temp.range = temp.max - temp.min;
      temp.medianHeight = -1;
      result.push(temp);
    }
    return result;
  };

  React.useEffect(() => {
    // console.log(vialData);
    setTrialData(summarizeSets(vialData));
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-10">
          <h3>Statistics Overview</h3>
        </div>
        <div className="col-2"><Button href="/uploadImages"><span>Return to start &#8617;</span></Button></div>
      </div>
      <p className="fw-light">
        <u>Summarized Data:</u>
      </p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Set Name</th>
            <th scope="col">Total Trials</th>
            <th scope="col">Total Flies</th>
            <th scope="col">Mean Climb</th>
            <th scope="col">Median Climb</th>
            <th scope="col">Standard Deviation</th>
            <th scope="col">Max Climb</th>
            <th scope="col">Min Climb</th>
          </tr>
        </thead>
        <tbody className="fw-light" key={trialData.toString()}>
          {trialData.length > 0 ? (
            trialData.map((v) => (
              <tr key={v.toString()}>
                <td>{v.label}</td>
                <td>{v.n}</td>
                <td>{v.numFlies}</td>
                <td>{v.meanHeight}</td>
                <td>{v.medianHeight}</td>
                <td>{v.stdDev}</td>
                <td>{v.max}</td>
                <td>{v.min}</td>
              </tr>
            ))
          ) : (
            <tr>
              <Spinner></Spinner>
            </tr>
          )}
        </tbody>
      </table>

      <p className="fw-light">
        <u>Raw Data:</u>
      </p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" style={{ width: "20%" }}>
              Set Name
            </th>
            <th scope="col" style={{ width: "20%" }}>
              Trial #
            </th>
            <th scope="col">Fly Heights</th>
          </tr>
        </thead>
        <tbody className="fw-light" key={trialData.toString()}>
          {vialData.length > 0 ? (
            vialData
              .sort((a: VialData, b: VialData) =>
                a.label.localeCompare(b.label)
              )
              .map((v: VialData) => (
                <tr key={v.toString()}>
                  <td>{v.label}</td>
                  <td>{v.n}</td>
                  <td>[{DataHandler.getYdata(v.rawData).toString()}]</td>
                </tr>
              ))
          ) : (
            <tr>
              <Spinner></Spinner>
            </tr>
          )}
        </tbody>
      </table>
      </div>
  );
}

export default StatReviewPage;
