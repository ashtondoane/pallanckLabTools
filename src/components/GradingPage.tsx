import * as React from "react";
import { FlySet } from "../App";
import { DataContext } from "../App";
import { Button } from "@cloudscape-design/components";
import Draggable from "react-draggable";

function GradingPage() {
  const [flySets, setFlySets] = React.useContext(DataContext);

  return (
    <div className="container-fluid px-5">
      <div className="row">
        <h3>Score Images</h3>
      </div>
      <div className="row" style={{height:"60vh"}}>
        <div className="col-6 border rounded px-3">brother</div>
        <div className="col-6 border rounded px-3">brot</div>
      </div>
      <div className="row border rounded my-3 px-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"># counted</th>
              <th scope="col">Mean Height</th>
              <th scope="col">Median Height</th>
              <th scope="col">Std Dev</th>
              <th scope="col">Min</th>
              <th scope="col">Max</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    // <div>
    //   <Draggable>
    //     <div style={{fontSize:60, color:"orange"}}>.</div>
    //   </Draggable>
    // </div>
  );
}

export default GradingPage;
