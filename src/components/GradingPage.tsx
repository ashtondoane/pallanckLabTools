import * as React from "react";
import { FlySet, VialData } from "../App";
import { FlySetContext } from "../App";
import { Button, Header } from "@cloudscape-design/components";
import Draggable from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { ProgressBar } from "@cloudscape-design/components";
import { Component, centerCrop } from "react-image-crop";
import Spinner from "@cloudscape-design/components/spinner";
import { getMaxHeight, getMean, getMedian, getMinHeight, getNumFlies, getStdDev, getYdata } from "../dataTools/DataHandling";
import { VialDataContext } from "../App";
import { Link } from "react-router-dom"
import axios from "axios";

function GradingPage() {
  const [vialData, setVialData] = React.useContext(VialDataContext);
  const [currentVial, setCurrentVial] = React.useState(0);
  const [imgDim, setImgDim] = React.useState([0, 0]);
  const [imgPos, setImgPos] = React.useState([0, 0]);
  const [flyPoints, setFlyPoints] = React.useState<{ x: number; y: number }[]>([]);  //stored as percentages of image height for rendering purposes
  const [uniqueKey, setUniqueKey] = React.useState(1);

  const fetchAPI = async (src:string)=>{
    const config = {
      headers: {
        'Content-Type' : 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        method: "POST",
        body: vialData[currentVial]
      }
    };
    const response = await axios.post("https://climbinganalysisflaskapi.onrender.com//predictLocations", config);
    return response;
    // const response = await axios.get("http://localhost:8080/predictLocations?src="+src.toString(),config);
    // return response;
  }

  

  //Resizes the boundaries of our image each time we resize the screen.
  React.useEffect(() => {
    function handleResize() {
      setImgDim([
        document.getElementById("climbingImage")?.getBoundingClientRect()
          .width!,
        document.getElementById("climbingImage")?.getBoundingClientRect()
          .height!,
      ]);
      setImgPos([
        document.getElementById("climbingImage")?.getBoundingClientRect().left!,
        document.getElementById("climbingImage")?.getBoundingClientRect().top!,
      ]);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Updates our stats every for currently showing points.
  const updateData = async (points:{x:number,y:number}[]) => {
    const copy = await JSON.parse(JSON.stringify(vialData));
    const temp:VialData = {
      label:copy[currentVial].label,
      n:copy[currentVial].n,
      src:copy[currentVial].src,
      numFlies: getNumFlies(points),
      meanHeight: getMean(points),
      medianHeight: getMedian(points),
      max: getMaxHeight(points),
      min: getMinHeight(points),
      stdDev: getStdDev(points),
      rawData: points
    };
    copy[currentVial] = temp; 
    setVialData(copy);
  };


  const onGenerateClick = async () => {
    //Create list of believed points and display them as draggables.
    const res = await fetchAPI(vialData[currentVial].src);
    const points = await res.data.prediction;
    const result = [];
    for (let i = 0; i < points.length; i++) {
      const invertedPoint = {x:0,y:0};
      invertedPoint.x = 1 - points[i].x;
      invertedPoint.y = 1 - points[i].y
      result.push(invertedPoint);
    }
    updateData(result);
    setFlyPoints(result);
    setUniqueKey(uniqueKey*1.014159265);
  };

  const onConfirmClick = () => {
    // //TODO:
    let newVial = currentVial + 1;
    setCurrentVial(newVial);
    setFlyPoints([]);
    setUniqueKey(uniqueKey*1.014159265);
  };

  const onContinueClick = () => {};

  if (vialData.length < 1) {
    return <div>Data is loading... <Spinner></Spinner></div>;
  }

  // console.log(vialData);

  return (
    <div className="container-fluid px-5">
      <div className="row">
        <h3>Score Images</h3>
        <p className="fw-light">Don't worry about noting data yet - it will be summed up for you at the end. </p>
      </div>
      <div className="row" style={{ height: "80vh" }}>
        <div
          className="col-4 border rounded px-3"
          id="boundingBox"
          style={{
            height: "70vh",
          }}
          key={flyPoints.toString()}
        >
          {flyPoints.length > 0
            ? flyPoints.map((p,i) => (
                <Draggable
                  key={i+uniqueKey}
                  positionOffset={{ x: -7.5, y: -7.5 }}
                  defaultPosition={{
                    x: (1-p.x)*imgDim[0],
                    y: (1-p.y)*imgDim[1],
                  }}
                  bounds={{
                    left: 0,
                    right: imgDim[0],
                    top: 0,
                    bottom: imgDim[1],
                  }}
                  onMouseDown={async (e:MouseEvent)=>{
                    if(e.shiftKey){
                      const copy = await JSON.parse(JSON.stringify(flyPoints));
                      await copy.splice(flyPoints.indexOf(p),1);
                      updateData(copy);
                      setFlyPoints(copy);
                      setUniqueKey(uniqueKey*1.012)
                    }
                  }}
                    onStop={(e: DraggableEvent) => {
                    const copy = JSON.parse(JSON.stringify(flyPoints));
                    copy[i] = {x:1-(Math.max(0,Math.min(imgDim[0],(e as MouseEvent).clientX-imgPos[0])))/imgDim[0],
                              y:1-(Math.max(0,Math.min(imgDim[1],(e as MouseEvent).clientY-imgPos[1])))/imgDim[1]};
                    setFlyPoints(copy);
                    updateData(copy);
                    setUniqueKey(uniqueKey*1.003);
                  }}
                >
                  <div
                    id="foobar"
                    style={{
                      height: "0px",
                      fontSize: 75,
                      color: "orange",
                      lineHeight: "0px",
                      cursor:"grab"
                    }}
                  >
                    ·
                  </div>
                </Draggable>
              ))
            : ""}
          {currentVial >= vialData.length ? (
            <div>DONE</div>
          ) : !vialData? (
            <Spinner />
          ) : (
            <img
              id="climbingImage"
              src={
                vialData[currentVial].src
              }
              // src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg/800px-Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg"
              style={{
                height: "100%",
                width: "auto",
                maxHeight: "80vh",
                maxWidth: "100%",
              }}
              onLoad={() => {
                if(vialData.length > 0 && vialData[currentVial].label.localeCompare("None") == 0){
                  setCurrentVial(currentVial+1)
                }
                setImgDim([
                  document
                    .getElementById("climbingImage")
                    ?.getBoundingClientRect().width!,
                  document
                    .getElementById("climbingImage")
                    ?.getBoundingClientRect().height!,
                ]);
                setImgPos([
                  document
                    .getElementById("climbingImage")
                    ?.getBoundingClientRect().left!,
                  document
                    .getElementById("climbingImage")
                    ?.getBoundingClientRect().top!,
                ]);
              }}
            />
          )}
        </div>
        <div className="col-8 border rounded px-3 align-content-center">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Statistic</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"># counted</th>
                <td>{currentVial < vialData.length && vialData[currentVial]&&vialData[currentVial].numFlies
                    ? vialData[currentVial].numFlies
                    : 0}</td>
              </tr>
              <tr>
                <th scope="row">Mean Height</th>
                <td>
                {currentVial < vialData.length &&vialData[currentVial]&&vialData[currentVial].meanHeight
                    ? vialData[currentVial].meanHeight
                    : 0}
                </td>
              </tr>
              <tr>
                <th scope="row">Median Height</th>
                <td>{currentVial < vialData.length &&vialData[currentVial]&&vialData[currentVial].medianHeight
                    ? vialData[currentVial].medianHeight
                    : 0}</td>
              </tr>
              <tr>
                <th scope="row">Std Dev</th>
                <td>{currentVial < vialData.length &&vialData[currentVial]&&vialData[currentVial].stdDev
                    ? vialData[currentVial].stdDev
                    : 0}</td>
              </tr>
              <tr>
                <th scope="row">Min</th>
                <td>{currentVial < vialData.length && vialData[currentVial]&&vialData[currentVial].min
                    ? vialData[currentVial].min
                    : 0}</td>
              </tr>
              <tr>
                <th scope="row">Max</th>
                <td>{currentVial < vialData.length &&vialData[currentVial]&&vialData[currentVial].max
                    ? vialData[currentVial].max
                    : 0}</td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <br></br>
          <center>
            <Button
            onClick={()=>{
              const copy = JSON.parse(JSON.stringify(flyPoints));
              copy.push({x:0,y:0});
              updateData(copy);
              setFlyPoints(copy);
            }}>
              Add Point
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              onClick={() => {
                onGenerateClick();
              }}
            >
              Generate
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              onClick={() => {
                onConfirmClick();
              }}
            >
              Confirm
            </Button>
            <br></br><br></br>
            (*Shift+Click will remove a point.)
          </center>
        </div>
        <div className="row py-3">
          <div className="col">
            <ProgressBar
              value={(currentVial/vialData.length)*100}
              additionalInfo={vialData.length.toString() + " image(s) to label."}
              description=""
              label="Set Progress:"
            />
          </div>
          <div className="col-3 py-3">
            {currentVial >= vialData.length ? (
              <Link to="../statReview"><Button
                onClick={() => {
                  onContinueClick();
                }}
              >
                Continue
              </Button>
              </Link>
            ) : (
              <Button disabled>Continue</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradingPage;
