import * as React from "react";
import { FlySetContext, VialDataContext } from "../App";
import { VialData } from "../App";
import * as DataHandler from "../dataTools/DataHandling";
import { Spinner } from "@cloudscape-design/components";
import { Button } from "@cloudscape-design/components";
import {CSVLink, CSVDownload} from "react-csv";

function StatReviewPage() {
  const [vialData, setVialData] = React.useContext(VialDataContext);
  const [trialData, setTrialData] = React.useState<VialData[]>([]);
  const [fileName, setFileName] = React.useState("");
  const [csvData, setCsvData] = React.useState<any[]>([]);

  const summarizeSets = (data: VialData[]) => {
    const setNames = [];
    let tempName = ""
    for (var vial of data) {
      if (setNames.indexOf(vial.label) == -1 && vial.label.localeCompare("None") != 0) {
        tempName += "_"+vial.label;
        setNames.push(vial.label);
      }
    }
    setFileName(tempName);
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
          // console.log(temp.rawData);
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

  const generateCSVData = (data:VialData[])=>{
    const csvTemp:any = [];
    vialData.sort((a: VialData, b: VialData) => a.label.localeCompare(b.label))
    for(var vial of vialData){
      let innerTemp:any[] = [];
      innerTemp.push(vial.label);
      innerTemp.push(vial.n);
      for (var p of vial.rawData){
        innerTemp.push(p.y);
      }
      csvTemp.push(innerTemp);
    }

    return csvTemp;
  }

  React.useEffect(() => {
    console.log(vialData);
    setTrialData(summarizeSets(vialData));
    setCsvData(generateCSVData(vialData));
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
      
      <CSVLink data={csvData} filename={"full_data_"+fileName} headers={["Set Name", "Trial #", "Fly Heights -->"]}>Download full trial data.</CSVLink>
      </div>
  );
}

export default StatReviewPage;
