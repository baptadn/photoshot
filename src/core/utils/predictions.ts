export const getRefinedInstanceClass = (instanceClass: string) => {
  return instanceClass === "man" || instanceClass === "woman"
    ? "person"
    : instanceClass;
};

export const getTrainCoefficient = (imagesCount: number) => {
  if (imagesCount > 25) {
    return 25;
  }

  if (imagesCount < 10) {
    return 10;
  }

  return imagesCount;
};
