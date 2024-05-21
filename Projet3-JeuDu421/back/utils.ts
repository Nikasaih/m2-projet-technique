export const isCombination = (combination:number[], input:number[])=>{
    return true;
}

export const fromCombinationToPoint = (input:number[])=>{
    if(isCombination([4,2,1], input)){
        return 10
    }
    return 0 
}