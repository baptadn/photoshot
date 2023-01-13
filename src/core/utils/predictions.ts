import { Project } from "@prisma/client";

export const getRefinedInstanceClass = (instanceClass: string) => {
  return instanceClass === "man" || instanceClass === "woman"
    ? "person"
    : instanceClass;
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

export const replacePromptToken = (prompt: string, project: Project) => {
  const refinedPrompt = prompt.replaceAll(
    "@me",
    `${project.instanceName} ${getRefinedInstanceClass(project.instanceClass)}`
  );

  return refinedPrompt;
};
