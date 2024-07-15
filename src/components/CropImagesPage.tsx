import * as React from "react";
import { FlySet } from "../App";
import EasyCrop from "./EasyCrop";
import { Button, ProgressBar } from "@cloudscape-design/components";

function CropImagesPage() {
  const [flySets, setFlySets] = React.useState<FlySet[]>([]);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    const storedData = sessionStorage.getItem("flySets");
    if (storedData) {
      setFlySets(JSON.parse(storedData));
    }
  }, []);

  function nextImage(croppedImage: string) {
    let result = flySets;
    result;
    setFlySets(result);
  }

  return (
    <div className="container-fluid">
      <div className="row" style={{ paddingBottom: "30px" }}>
        <h3>Crop Images</h3>
        <div className="col-8">
          <ProgressBar
            additionalInfo={(6 - currentImage).toString() + " image(s) left"}
          />
        </div>
        <div className="col-4">
          <center>
            {currentImage == flySets.length ? (
              <Button fullWidth href="" onClick={() => {}}>
                Continue
              </Button>
            ) : (
              <Button fullWidth disabled>Continue</Button>
            )}
          </center>
        </div>
      </div>
      <div className="row">
        <EasyCrop
          src={
            flySets[currentImage] ? flySets[currentImage].labeledImage! : "none"
          }
          onClick={nextImage}
        />
      </div>
    </div>
  );
}

export default CropImagesPage;
