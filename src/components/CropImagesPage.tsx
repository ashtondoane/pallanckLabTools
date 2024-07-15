import * as React from "react";
import { FlySet } from "../App";
import { Button, ProgressBar } from "@cloudscape-design/components";
import { DataContext } from "../App";
import Cropper from "react-easy-crop";
import Slider from "@cloudscape-design/components/slider";
import { Link } from "react-router-dom";
import getCroppedImg from "./CropImages";

function CropImagesPage() {
  const [flySets, setFlySets] = React.useContext(DataContext);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [currentSet, setCurrentSet] = React.useState(0);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [rotationSliderVal, setRotationSliderVal] = React.useState(0);
  const [key, setKey] = React.useState(0); //Key to manually reset size when width/height changes
  const [width, setWidth] = React.useState(600);
  const [height, setHeight] = React.useState(300);

  const onCropComplete = (croppedAreaPercentage:any, croppedAreaPixels:any) => {
		setCroppedArea(croppedAreaPixels);
	};

  const resetCropper = ()=>{
    setRotation(0);
  }

  const onBackClick = ()=>{
    const newImg = currentImage-1;
    if(newImg<0){
      setCurrentSet(currentSet-1);
      setCurrentImage(4);
    }else{
      setCurrentImage(newImg);
    }
    resetCropper();
  }

  const onCropClick = async ()=>{
    const img = await getCroppedImg(flySets[currentSet].dataImages[currentImage], croppedArea);
    const temp = flySets;
    if(!flySets[currentSet].croppedImages){
      flySets[currentSet].croppedImages = [null,null,null,null,null];
    }
    flySets[currentSet].croppedImages[currentImage] = img;
    setFlySets(temp);
    const newImg = currentImage+1;
    if(newImg%5==0){
      setCurrentSet(currentSet+1);
      setCurrentImage(0);
    }else{
      setCurrentImage(newImg);
    }
    resetCropper();
  }

  // Crop each image into 6 individual ones and pass along this data into flySets.individualVials
  // const onContinueClick = ()=>{
  //   for(var set of flySets){
  //     set.dataImages = null;
  //   }
  // }

  if(!flySets){
    return (<div>Cannot find data...</div>)
  }

  return (
    <div className="container-fluid">
      <div className="row" style={{ paddingBottom: "30px" }}>
        <h3>Crop Images</h3>
        <div className="col-8">
          <ProgressBar
            value = {(5*currentSet+currentImage)/(flySets.length*5)*100}
            additionalInfo={(flySets.length*5 - (5*currentSet+currentImage)).toString() + " image(s) left"}
          />
        </div>
        <div className="col-4">
          <center>
            {currentSet == flySets.length ? (
              <Link to="../gradeImages"><Button fullWidth>
                Continue
              </Button>
              </Link>
            ) : (
              <Button fullWidth disabled>Continue</Button>
            )}
          </center>
        </div>
      </div>
      <div className="row">
        <div className="col-3 border rounded">
          <center className="fw-light" style={{ marginTop: "10px" }}>
            <u>Width</u>
            <Slider
              onChange={({ detail }) => {
                setWidth(detail.value);
                setKey(key + 1);
              }}
              value={width}
              max={1000}
              min={10}
            />
            <u>Height</u>
            <Slider
              onChange={({ detail }) => {
                setHeight(detail.value);
                setKey(key + 1);
              }}
              value={height}
              max={600}
              min={10}
            />
            <u>Rotation</u>
            <Slider
              onChange={({ detail }) => {
                setRotationSliderVal(detail.value);
                setRotation(detail.value);
              }}
              value={rotationSliderVal}
              max={30}
              min={-30}
            />
            <br></br>
            <br></br>
            {/* Makes the current image fill the whole space to get a better view*/}
            {currentSet==0&&currentImage==0?<Button disabled>Back</Button>:<Button onClick={()=>{onBackClick()}}>Back</Button>}
            &nbsp;&nbsp;&nbsp;
            {currentSet==flySets.length?<Button disabled>Crop</Button>:<Button onClick={()=>{onCropClick()}}>Crop</Button>}
          </center>
        </div>
        <div className="col-9 border rounded">
        {currentSet==flySets.length?<center>DONE</center>:<div
            className="crop-container"
            style={{
              position: "relative",
              width: "100%",
              height: "60vh",
              background: "#333",
            }}
          >
            <Cropper
              key={key}
              image={flySets[currentSet].dataImages[currentImage]}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              zoomSpeed={2}
              maxZoom={3}
              zoomWithScroll={true}
              showGrid={true}
              cropSize={{ width: width, height: height }}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </div>}
        </div>
        <div className="row fw-light" style={{ paddingTop: "20px" }}>
          <u><h6>Guidelines:</h6></u>
          <text>
            Please ensure that the top/bottom are aligned with the{" "}
            <u>inside edges</u> of the metal plate, and that the sides are
            centered approximately <u>half way between the holes</u> in the side
            plate. &nbsp;
            <a href="public/goodCrop.png" target="_blank">
              A well cropped image.{" "}
            </a>
          </text>
        </div>
      </div>
    </div>
  );
}

export default CropImagesPage;
