import * as React from "react";
import FileUpload from "./FileUpload";
import Button from "@cloudscape-design/components/button";
import {FlySet} from "../App";
import { Link } from "react-router-dom";
import { FlySetContext } from "../App";

function ClimbingAssayPage(){
  const [images, setImages] = React.useState<string[]>([]);
  const [flySets, setFlySets] = React.useContext(FlySetContext);
  const [validity, setValidity] = React.useState(false);

  function organizeToSets(images:string[]){
    if(images.length == 0){
      alert("No images found. Please try again.")
    }
    else if(images.length%6 != 0){
      alert("Incorrect data formatting found. Please ensure correct types and number of images.");
    }

    let currSet:FlySet = {};
    let result:FlySet[] = [];
    for(var i=0;i<images.length;i++){
      if(i%6==0){
        if(i != 0){
          result.push(currSet);
        }
        currSet = {labeledImage:images[i]};
      }
      else{
        if(currSet.dataImages == null){
          currSet.dataImages = [images[i]];
        }else{
          currSet.dataImages.push(images[i]);
        }
      }
    }
    result.push(currSet);
    setFlySets(result);
  }

  //Takes in files and converts to URL image format.
  function readFileAsURL(file:File){
    return new Promise<any>(function(resolve,reject){
        let fr = new FileReader();

        fr.onload = function(){
            resolve(fr.result);
        };

        fr.onerror = function(){
            reject(fr);
        };

        fr.readAsDataURL(file); 
    });
}

  const onUpload = async (data:File[]) => {
    if(data.length == 0 || data.length%6 != 0){
      setValidity(false);
    }
    else{
      setValidity(true);
    }
    let convertedData:string[] = []
    for(var image of data){
      await readFileAsURL(image).then((fileContent)=>{
        convertedData.push(fileContent);
      });
    }
    setImages(convertedData);
  }
  
  return (
    <div className="container">
      <div className="row">
          <h3>The Fly Climbing Assay Automated</h3>
        <p className="fs-6 fw-light">
          <u>Overview</u>
          <br></br>
          This is an internal tool for the Pallanck Laboratory intended to
          automate the process of analyzing fly climbing behavior in this assay.
          <br></br><br></br>
          <u>File Structure</u>
          <br></br>
          Please structure files as such:
        </p>
          <ol type="1" className="fs-6 fw-light" style={{marginLeft:"30px"}}>
              <li>Upload files in sets of six such that we have repeating sets of 1 labeled image followed by 5 images of trial runs.</li>
              <li>As many files can be included as one wishes. However, the current file system is prone to human error in ordering. Please keep this in mind.</li>
              <li>Files must be in .JPG format.</li>
          </ol>
        <p className="fs-6 fw-light">
           Please reach out with any concerns about the tool to ashtondoane@gmail.com
        </p>
      </div>
      <div className="row py-4 border-bottom"></div>
      <div className="row py-4">
        <div className="col-4">
          <u>
            <h4>Getting Started</h4>
          </u>
          <FileUpload onUpload={onUpload}/>
        </div>
        <div className="col-8 border rounded align-content-center overflow-auto" style={{maxHeight:"30vh"}}>
          <center>{images.length>0?images.map((img)=><img key={img[0]} src={img} style={{width:"8vw",height:"8vw  ",borderRadius:"20px",padding:"5px"}}/>):"No preview available."}</center>
        </div>
      </div>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-8">
        <Link to={validity?"../labelImages":""}>
          <Button fullWidth onClick={()=>{organizeToSets(images);}}>
            Submit
          </Button></Link>
        </div>
      </div>
    </div>
  );
}

export default ClimbingAssayPage;