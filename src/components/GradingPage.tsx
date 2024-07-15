import * as React from "react";
import { FlySet } from "../App";
import { DataContext } from "../App";

function GradingPage(){
    const [flySets, setFlySets] = React.useContext(DataContext);
    console.log(flySets);
    return(
        <div>
            {flySets.length}
        </div>
    )
}

export default GradingPage;