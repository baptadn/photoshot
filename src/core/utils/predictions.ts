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

export const extractSeedFromLogs = (logsContent: string) => {
  try {
    const logLines = logsContent.split("\n");
    const seedLine = logLines[0];
    const seedValue = seedLine.split(":")[1].trim();

    return seedValue ? Number(seedValue) : undefined;
  } catch (e) {
    return undefined;
  }
};
