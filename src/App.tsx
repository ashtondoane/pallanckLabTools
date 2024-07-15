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

interface FlySet{
  labels?:string[],
  labeledImage?:string,
  dataImages?:string[],
  croppedImages?:string[]
}

interface FlyData{
  numFlys?:number,
  heights?:number[]
  averageHeight?:number
  stdDev?:number
  max?:number,
  min?:number
}

export const DataContext = React.createContext<any[]>([]);

function App() {
  //Store data for the images that have been uploaded and their analysis.
  const [flySets, setFlySets] = React.useState<FlySet[]>([]); //Groupings of fly images into sets of 6.

  return (
    <DataContext.Provider value={[flySets, setFlySets]}>
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
                <Route path="/statReview" element={<></>}></Route>
                <Route path="/testPage" element={<>Hooray is working</>}></Route>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
}

export type {FlySet as FlySet};
export type {FlyData as FlyData};
export default App;
