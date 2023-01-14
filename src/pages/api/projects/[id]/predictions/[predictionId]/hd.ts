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

  if (req.method === "POST") {
    if (shot.hdStatus !== "NO") {
      return res.status(400).json({ message: "4K already applied" });
    }

    const { data } = await replicateClient.post(
      `https://api.replicate.com/v1/predictions`,
      {
        input: {
          image: shot.outputUrl,
          upscale: 8,
          face_upsample: true,
          codeformer_fidelity: 1,
        },
        version: process.env.REPLICATE_HD_VERSION_MODEL_ID,
      }
    );

    shot = await db.shot.update({
      where: { id: shot.id },
      data: { hdStatus: "PENDING", hdPredictionId: data.id },
    });

    return res.json({ shot });
  }

  if (req.method === "GET") {
    if (shot.hdStatus !== "PENDING") {
      return res.status(400).json({ message: "4K already applied" });
    }

    const { data: prediction } = await replicateClient.get(
      `https://api.replicate.com/v1/predictions/${shot.hdPredictionId}`
    );

    if (prediction.output) {
      shot = await db.shot.update({
        where: { id: shot.id },
        data: {
          hdStatus: "PROCESSED",
          hdOutputUrl: prediction.output,
        },
      });
    }

    return res.json({ shot });
  }

  return res.status(405).json({ message: "Method not allowed" });
};

export default handler;
