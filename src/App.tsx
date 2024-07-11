import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import ListGroup from "./components/ListGroup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClimbingAssayPage from "./components/ClimbingAssayPage";
import LabelImagesPage from "./components/LabelImagesPage";
import HomePage from "./components/HomePage";
import CropImagesPage from "./components/CropImagesPage"

interface FlySet{
  labels?:string[],
  labeledImage?:string,
  dataImages?:string[]
}

function App() {
  //Store data for the images that have been uploaded and their analysis.
  const [flyImages, setFlyImages] = React.useState([]);
  const [flySets, setFlySets] = React.useState([]); //Groupings of fly images into sets of 6.
  const [flyData, setFlyData] = React.useState([]);

  //Load images into state
  React.useEffect(() => {
    const storedImages = sessionStorage.getItem('flyImages');
    if (storedImages) {
      setFlyImages(JSON.parse(storedImages));
    }
  }, []);

  //Load flyData into state
  React.useEffect(() => {
    const storedData = sessionStorage.getItem('flyData');
    if (storedData) {
      setFlyData(JSON.parse(storedData));
    }
  }, []);
  return (
    <>
      <Header />
      <div className="container-fluid" style={{ minHeight: "100vh" }}>
        <div
          className="row"
          style={{ alignItems: "stretch", minHeight: "100vh"}}
        >
          <SideBar />
          <div className="col" style={{ padding: "20px" }}>
            <BrowserRouter>
              <Routes>
              <Route path="" element={<HomePage />}></Route>
                <Route path="/uploadImages" element={<ClimbingAssayPage />}></Route>
                <Route path="/labelImages" element={<LabelImagesPage></LabelImagesPage>}></Route>
                <Route path="/cropImages" element={<CropImagesPage></CropImagesPage>}></Route>
                <Route path="/gradeImages" element={<></>}></Route>
                <Route path="/statReview" element={<></>}></Route>
                <Route path="/testPage" element={<>Hooray is working</>}></Route>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </>
  );
}

export type {FlySet as FlySet};
export default App;
