import * as React from "react";

function LabelImagesPage(){
    console.log(sessionStorage.getItem("src"));
    return (
        <>
            <img src={JSON.parse(sessionStorage.getItem("flyImages")!)[0]} style={{height:"200px",width:"200px"}} />
        </>
    )
}

export default LabelImagesPage;