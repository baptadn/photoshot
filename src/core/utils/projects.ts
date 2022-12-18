import { Project } from "@prisma/client";

export const getRefinedStudioName = (project: Project) => {
  if (
    project.instanceName === process.env.NEXT_PUBLIC_REPLICATE_INSTANCE_TOKEN
  ) {
    return project.name;
  }

  return project.instanceName;
};
