import * as React from "react";
import { FlySet } from "../App";
import { DataContext } from "../App";
import { Button } from "@cloudscape-design/components";
import Draggable from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { ProgressBar } from "@cloudscape-design/components";
import { centerCrop } from "react-image-crop";


function GradingPage() {
  const [flySets, setFlySets] = React.useContext(DataContext);
  const [currentSet, setCurrentSet] = React.useState(0);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [imgDim, setImgDim] = React.useState([0, 0]);
  const [imgPos, setImgPos] = React.useState([0, 0]);

  //Resizes the boundaries of our image each time we resize the screen.
  React.useEffect(() => {
    function handleResize() {
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
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onGenerateClick = ()=>{
    //Create list of believed
  }

  const onConfirmClick = () => {
    // //TODO:
    setCurrentImage(currentImage + 1);
    // console.log(document.getElementById("foobar")?.getBoundingClientRect().top);
    // console.log(document.getElementById("boundingBox")?.getBoundingClientRect().top-document.getElementById("boundingBox")?.getBoundingClientRect().height/2);
  };

  return (
    <div className="container-fluid px-5">
      <div className="row">
        <h3>Score Images</h3>
      </div>
      <div className="row" style={{ height: "80vh" }}>
        <div
          className="col-6 border rounded px-3"
          id="boundingBox"
          style={{
            height: "70vh",
          }}
        >
          <Draggable
            positionOffset={{ x: -7.5, y: -7.5 }}
            defaultPosition={{ x: 0, y: 0 }}
            bounds={{
              left: 0,
              right: imgDim[0],
              top: 0,
              bottom: imgDim[1],
            }}
            onStop={(e:DraggableEvent)=>{
                //Log percent of image taken in y direction
                console.log(((e as MouseEvent).clientY-imgPos[1])/imgDim[1] + "%")
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
          <img
            id="climbingImage"
            src={flySets[0] ? flySets[0].labeledImage : ""}
            // src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg/800px-Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg"
            style={{
              height: "100%",
              width: "auto",
              maxHeight: "80vh",
              maxWidth: "100%",
            }}
            onLoad={() => {
            //   console.log(document.getElementById("climbingImage"));
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
        <div className="col-6 border rounded px-3 align-content-center">
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
                <td>bonk</td>
              </tr>
              <tr>
                <th scope="row">Mean Height</th>
                <td>bonk</td>
              </tr>
              <tr>
                <th scope="row">Std Dev</th>
                <td>bonk</td>
              </tr>
              <tr>
                <th scope="row">Min</th>
                <td>bonk</td>
              </tr>
              <tr>
                <th scope="row">Max</th>
                <td>bonk</td>
              </tr>
              <tr>
                <th scope="row">Median</th>
                <td>bonk</td>
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
          <ProgressBar
            value={100}
            additionalInfo={flySets.length.toString() + " image(s) to label."}
            description=""
            label="Set Progress:"
          />
        </div>
      </div>
    </div>
  );
}

export default GradingPage;
