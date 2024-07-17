import * as React from "react";
import { FlySet, VialData } from "../App";
import { FlySetContext } from "../App";
import { Button, Header } from "@cloudscape-design/components";
import Draggable from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { ProgressBar } from "@cloudscape-design/components";
import { Component, centerCrop } from "react-image-crop";
import Spinner from "@cloudscape-design/components/spinner";
import { getMaxHeight, getMean, getMedian, getMinHeight, getNumFlies } from "../dataTools/DataHandling";
import { VialDataContext } from "../App";
import { Link } from "react-router-dom"
import axios from "axios";

function GradingPage() {
  const [vialData, setVialData] = React.useContext(VialDataContext);
  const [currentVial, setCurrentVial] = React.useState(0);
  const [imgDim, setImgDim] = React.useState([0, 0]);
  const [imgPos, setImgPos] = React.useState([0, 0]);
  const [flyPoints, setFlyPoints] = React.useState<{ x: number; y: number }[]>([]);  //stored as percentages of image height for rendering purposes

  const fetchAPI = async (src:string)=>{
    const response = await axios.get("http://localhost:8080/predictLocations?data="+src);
    return response;
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
  const updateData = (points:{x:number,y:number}[]) => {
    const copy = JSON.parse(JSON.stringify(vialData));
    const temp:VialData = {
      label:copy[currentVial].label,
      n:copy[currentVial].n,
      src:copy[currentVial].src,
      numFlies: getNumFlies(points),
      meanHeight: getMean(points),
      medianHeight: getMedian(points),
      max: getMaxHeight(points),
      min: getMinHeight(points)
    };
    copy[currentVial] = temp; 
    setVialData(copy);
  };


  const onGenerateClick = async () => {
    //Create list of believed points and display them as draggables.
    const res = await fetchAPI(vialData[currentVial]);
    const points = await res.data.prediction;
    const result = [];
    for (let i = 0; i < points.length; i++) {
      result.push(points[i]);
    }
    updateData(result);
    setFlyPoints(result);
  };

  const onConfirmClick = () => {
    // //TODO:
    let newVial = currentVial + 1;
    setCurrentVial(newVial);
  };

  const onContinueClick = () => {};

  if (vialData.length < 1) {
    return <div>Data not found...</div>;
  }

  // console.log(vialData);

  return (
    <div className="container-fluid px-5">
      <div className="row">
        <h3>Score Images</h3>
        <p className="fw-light">Don't worry about noting data yet - it will be summed up for you at the end.</p>
      </div>
      <div className="row" style={{ height: "80vh" }}>
        <div
          className="col-4 border rounded px-3"
          id="boundingBox"
          style={{
            height: "70vh",
          }}
        >
          {flyPoints.length > 0
            ? flyPoints.map((p,i) => (
                <Draggable
                  positionOffset={{ x: -7.5, y: -7.5 }}
                  defaultPosition={{
                    x: (p.x * imgDim[0]) / 100,
                    y: (p.y * imgDim[1]) / 100,
                  }}
                  bounds={{
                    left: 0,
                    right: imgDim[0],
                    top: 0,
                    bottom: imgDim[1],
                  }}
                  onStop={(e: DraggableEvent) => {
                    //Log percent of image taken in y direction
                    const copy = JSON.parse(JSON.stringify(flyPoints));
                    copy[i] = {x:Math.min(imgPos[0]+imgDim[0],(e as MouseEvent).clientX-imgPos[0]), y:Math.min(imgPos[1]+imgDim[1],(e as MouseEvent).clientY-imgPos[1])}
                    console.log(copy);
                    setFlyPoints(copy);
                  }}
                >
                  <div
                    id="foobar"
                    style={{
                      height: "0px",
                      fontSize: 75,
                      color: "orange",
                      lineHeight: "0px",
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
          {/* <div
            style={{
              fontSize: 75,
              color: "orange",
              position: "absolute",
              top: document.getElementById("climbingImage")?.getBoundingClientRect().height,
              left: document.getElementById("climbingImage")?.getBoundingClientRect().left,
            }}
          >
            .
          </div> */}
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
                <td>{currentVial < vialData.length &&vialData[currentVial]&&vialData[currentVial].min
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
