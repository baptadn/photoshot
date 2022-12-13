import replicateClient from "@/core/clients/replicate";
import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const predictionId = req.query.predictionId as string;

  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  let shot = await db.shot.findFirstOrThrow({
    where: { projectId: project.id, id: predictionId },
  });

  if (req.method === "GET") {
    const { data: prediction } = await replicateClient.get(
      `https://api.replicate.com/v1/predictions/${shot.replicateId}`
    );

    shot = await db.shot.update({
      where: { id: shot.id },
      data: {
        status: prediction.status,
        outputUrl: prediction.output?.[0] || null,
      },
    });

    return res.json({ shot });
  } else if (req.method === "PATCH") {
    const { bookmarked } = req.body;

    shot = await db.shot.update({
      where: { id: shot.id },
      data: {
        bookmarked: bookmarked || false,
      },
    });

    return res.json({ shot });
  }

  return res.status(405).json({ message: "Method not allowed" });
};

export default handler;
