import * as React from "react";
import ProgressBar from "@cloudscape-design/components/progress-bar";
import { Button } from "@cloudscape-design/components";
import { FlySet } from "../App";
import { Link } from "react-router-dom";
import { FlySetContext } from "../App";

function LabelImagesPage() {
  const [currentImage, setCurrentImage] = React.useState(0);
  const [flySets, setFlySets] = React.useContext(FlySetContext);

  if (flySets.length < 1) {
    return <div>No files found. Please return to the prior step.</div>;
  }

  const onBackClick = () => {
    let newImg = currentImage - 1;
    let temp: string[] = [];
    for (let i = 1; i <= 6; i++) {
      let key: string = "input" + i.toString();
      const input = document.getElementById(key) as HTMLInputElement;
      temp.push(input?.value);
      input.value = flySets[newImg].labels[i - 1];
    }
    if (currentImage != flySets.length) {
      flySets[currentImage].labels = temp;
    }
    setCurrentImage(newImg);
  };

  const onNextClick = () => {
    let newImg = currentImage + 1;
    let temp: string[] = [];
    for (let i = 1; i <= 6; i++) {
      let key: string = "input" + i.toString();
      const input = document.getElementById(key) as HTMLInputElement;
      temp.push(input.value);
      if (newImg == flySets.length) {
        input.value = "------------------------";
      } else {
        input.value =
          flySets && flySets[newImg].labels
            ? flySets[newImg].labels[i - 1]
            : input.defaultValue;
      }
    }
    flySets[currentImage].labels = temp;
    setCurrentImage(newImg);
  };

  const onContinueClick = () => {
    
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <h3>Mark the Labeled Images</h3>
      </div>
      <div className="row">
        <div className="col-3 fw-light">
          Please label the sets based on the image displayed.
          <br></br>
          <center>
            <input
              id="input1"
              defaultValue="Set 1"
              style={{ margin: "10px" }}
              readOnly={currentImage == flySets.length ? true : false}
            />
            <input
              id="input2"
              defaultValue="Set 2"
              style={{ margin: "10px" }}
              readOnly={currentImage == flySets.length ? true : false}
            />
            <input
              id="input3"
              defaultValue="Set 3"
              style={{ margin: "10px" }}
              readOnly={currentImage == flySets.length ? true : false}
            />
            <input
              id="input4"
              defaultValue="Set 4"
              style={{ margin: "10px" }}
              readOnly={currentImage == flySets.length ? true : false}
            />
            <input
              id="input5"
              defaultValue="Set 5"
              style={{ margin: "10px" }}
              readOnly={currentImage == flySets.length ? true : false}
            />
            <input
              id="input6"
              defaultValue="Set 6"
              style={{ margin: "10px" }}
              readOnly={currentImage == flySets.length ? true : false}
            />
            {currentImage == 0 ? (
              <Button disabled>Back</Button>
            ) : (
              <Button
                onClick={() => {
                  onBackClick();
                }}
              >
                Back
              </Button>
            )}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {currentImage >= flySets.length ? (
              <Button disabled>Next</Button>
            ) : (
              <Button
                onClick={() => {
                  onNextClick();
                }}
              >
                Next
              </Button>
            )}
          </center>
        </div>
        <div
          className="col-9 border align-content-center"
          style={{ height: "60vh" }}
        >
          <center>
            {currentImage < flySets.length ? (
              <img
                className="responsive-img"
                src={flySets[currentImage].labeledImage}
                style={{
                  height: "100%",
                  width: "auto",
                  maxHeight: "60vh",
                  maxWidth: "100%",
                  padding: "5px",
                }}
              />
            ) : (
              <div style={{ minHeight: "60vh" }}>DONE</div>
            )}
          </center>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <ProgressBar
            value={(currentImage / flySets.length) * 100}
            additionalInfo={flySets.length.toString() + " image(s) to label."}
            description=""
            label="Set Progress:"
          />
        </div>
        <div className="col-4 align-content-center">
          <center>
            {currentImage < flySets.length ? (
              <Button disabled>Continue to cropping</Button>
            ) : (
              <Link to="../cropImages">
                <Button
                  onClick={() => {
                    onContinueClick();
                  }}
                >
                  Continue to cropping
                </Button>
              </Link>
            )}
          </center>
        </div>
      </div>
    </div>
  );
}

export default LabelImagesPage;
