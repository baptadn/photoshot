import replicateClient from "@/core/clients/replicate";
import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const session = await getSession({ req });
  let modelStatus = "not_created";

  if (session?.user) {
    const project = await db.project.findFirstOrThrow({
      where: { id: projectId, userId: session.userId },
    });

    if (project?.replicateModelId) {
      const response = await replicateClient.get(
        `/v1/trainings/${project.replicateModelId}`
      );

      modelStatus = response?.data?.status || modelStatus;
    }

    res.json({ project, modelStatus });
  }

  res.status(401).json({ message: "Not authenticated" });
};

export default handler;
