export const getRefinedInstanceClass = (instanceClass: string) => {
  return instanceClass === "man" || instanceClass === "woman"
    ? "person"
    : instanceClass;
};
