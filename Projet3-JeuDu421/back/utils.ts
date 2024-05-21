export const isCombination = (combination:number[], input:number[])=>{
    combination.sort((a,b)=> a-b)
    input.sort((a,b)=> a-b)

    if(combination[0] === input[0] && combination[1] === input[1] && combination[2] === input[2] )    {
        return true;
    }
    return false
}

export const fromCombinationToPoint = (input:number[])=>{
    if(isCombination([4,2,1], input)){
        return 10
    }
    return 0 
}