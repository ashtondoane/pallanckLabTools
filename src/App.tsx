import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import ClimbingAssayPage from "./components/ClimbingAssayPage";
import LabelImagesPage from "./components/LabelImagesPage";
import HomePage from "./components/HomePage";
import CropImagesPage from "./components/CropImagesPage"
import GradingPage from "./components/GradingPage";
import StatReviewPage from "./components/StatReviewPage";

interface FlySet{
  labels?:string[],
  labeledImage?:string,
  dataImages?:string[],
  croppedImages?:string[],
  individualVials?:string[][] //Index of data images corresponds to list of 6 vials individually cut.
}

interface VialData{
  label:string,
  n:number,
  src:string,
  numFlies?:number,
  heights?:number[]
  meanHeight?:number,
  medianHeight?:number,
  stdDev?:number
  max?:number,
  min?:number,
  range?:number,
  rawData:{x:number,y:number}[]
}

export const FlySetContext = React.createContext<any[]>([]);
export const VialDataContext = React.createContext<any[]>([]);

function App() {
  //Store data for the images that have been uploaded and their analysis.
  const [flySets, setFlySets] = React.useState<FlySet[]>([]); //Groupings of fly images into sets of 6.
  const [vialData, setVialData] = React.useState<VialData[]>([]);

  return (
    <FlySetContext.Provider value={[flySets, setFlySets]}>
      <VialDataContext.Provider value={[vialData, setVialData]}>
      <Header />
      <div className="container-fluid" style={{ minHeight: "100vh" }}>
        <div
          className="row"
          style={{ alignItems: "stretch", minHeight: "100vh"}}
        >
          <SideBar />
          <div className="col" style={{ padding: "20px" }}>
            <BrowserRouter basename="/">
              <Routes>
                <Route path="" element={<HomePage />}></Route>
                <Route path="/uploadImages" element={<ClimbingAssayPage/>}></Route>
                <Route path="/labelImages" element={<LabelImagesPage></LabelImagesPage>}></Route>
                <Route path="/cropImages" element={<CropImagesPage></CropImagesPage>}></Route>
                <Route path="/gradeImages" element={<GradingPage></GradingPage>}></Route>
                <Route path="/statReview" element={<StatReviewPage></StatReviewPage>}></Route>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
      </VialDataContext.Provider>
    </FlySetContext.Provider>
  );
}

export type {FlySet as FlySet};
export type {VialData as VialData};
export default App;
