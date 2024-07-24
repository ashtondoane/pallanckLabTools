// Functions for getting and displaying data about fly climbs.

export const getNumFlies = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
    return points.length;
}

export const getMean = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
    let sum = 0;
    for(var p of points){
        sum += p.y;
    }
    return sum/points.length;
}

export const getMedian = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
    const temp = [];
    for(var p of points){
        temp.push(p);
    }
    temp.sort((a,b)=>a.y-b.y);
    if(temp.length % 2 == 1){
        return temp[Math.floor(temp.length/2)].y;
    }else{
        return temp[Math.floor(temp.length/2)-1].y;
    }
}

export const getStdDev = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
    const mean = getMean(points);
    const n = getNumFlies(points);
    let summedSquareDiff = 0;
    for(var p of points){
        summedSquareDiff += Math.pow(p.y-mean,2);
    }
    return Math.sqrt(summedSquareDiff/(n-1));
}

export const getRange = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
}

export const getMinHeight = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
    let min = 100000;
    for(var p of points){
        if (p.y  < min){
            min = p.y;
        }    
    }
    return min;
}

export const getMaxHeight = (points:{x:number,y:number}[])=>{
    if (points.length < 1){
        return NaN
    }
    // console.log(points);
    let max = -1;
    for(var p of points){
        if (p.y > max){
            max = p.y;
        }    
    }
    return max;
}

export const getYdata = (points:{x:number,y:number}[])=>{
    const temp = [];
    for(var p of points){
        temp.push(Math.round(p.y*100)/100);
    }
    return temp;
}
