export const isCombination = (combination: number[], input: number[]) => {
  combination.sort((a, b) => a - b);
  input.sort((a, b) => a - b);

  if (
    combination[0] === input[0] &&
    combination[1] === input[1] &&
    combination[2] === input[2]
  ) {
    return true;
  }
  return false;
};

export const fromCombinationToPoint = (input: number[]) => {
  if (isCombination([4, 2, 1], input)) {
    return 10;
  } else if (isCombination([1, 1, 1], input)) {
    return 7;
  } else if (isCombination([6, 6, 6], input)) {
    return 7;
  } else if (isCombination([5, 5, 5], input)) {
    return 7;
  } else if (isCombination([4, 4, 4], input)) {
    return 7;
  } else if (isCombination([3, 3, 3], input)) {
    return 7;
  } else if (isCombination([2, 2, 2], input)) {
    return 7;
  } else if (isCombination([6, 5, 4], input)) {
    return 6;
  } else if (isCombination([5, 4, 3], input)) {
    return 5;
  } else if (isCombination([4, 3, 2], input)) {
    return 4;
  } else if (isCombination([3, 2, 1], input)) {
    return 3;
  }
  return 0;
};
