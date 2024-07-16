// Functions for getting and displaying data about fly climbs.

export const getNumFlies = (points:{x:number,y:number}[])=>{
    return points.length;
}

export const getMean = (points:{x:number,y:number}[])=>{
    let sum = 0;
    for(var p of points){
        sum += p.y;
    }
    return sum/points.length;
}

export const getMedian = (points:{x:number,y:number}[])=>{
    const temp = points.sort(({x:a},{x:b})=>a-b);
    if(temp.length % 2 == 1){
        return temp[Math.floor(temp.length/2)].y;
    }else{
        return temp[Math.floor(temp.length/2)-1].y;
    }
}

export const getStdDev = (points:{x:number,y:number}[])=>{

}

export const getRange = (points:{x:number,y:number}[])=>{

}

export const getMinHeight = (points:{x:number,y:number}[])=>{
    return points.sort(({x:a},{x:b})=>a-b)[0].y;
}

export const getMaxHeight = (points:{x:number,y:number}[])=>{
    return points.sort(({x:a},{x:b})=>a-b)[points.length-1].y;
}

