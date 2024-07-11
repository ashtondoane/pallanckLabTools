import React, { useState } from "react";
import Cropper from "react-easy-crop";
import Slider from "@cloudscape-design/components/slider";
import { Button, ProgressBar } from "@cloudscape-design/components";

interface CropProps {
  src: string;
  onClick: (flySet: string) => void;
}

function EasyCrop({ src, onClick }: CropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [rotationSliderVal, setRotationSliderVal] = React.useState(0);
  const [key, setKey] = React.useState(0); //Key to manually reset size when width/height changes
  const [width, setWidth] = React.useState(50);
  const [height, setHeight] = React.useState(50);

  return (
    <div className="container">
      <div className="row">
        <div className="col-3 border rounded">
          <center className="fw-light" style={{marginTop:"10px"}}>
            <u>Width</u> 
            <Slider
              onChange={({ detail }) => {
                setWidth(detail.value);
                setKey(key+1);
              }}
              value={width}
              max={600}
              min={10}
            />
            <u>Height</u> 
            <Slider
              onChange={({ detail }) => {
                setHeight(detail.value);
                setKey(key+1);
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
            <br></br><br></br>
            {/* Makes the current image fill the whole space to get a better view*/}
            <Button>Crop</Button>
            &nbsp;&nbsp;&nbsp;
            <Button>Confirm</Button>
          </center>
        </div>
        <div className="col-9">
          <div
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
              image={src}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              zoomSpeed={2}
              maxZoom={3}
              zoomWithScroll={true}
              showGrid={true}
              cropSize={{width:width,height:height}}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EasyCrop;
