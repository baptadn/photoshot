import replicateClient from "@/core/clients/replicate";
import s3Client from "@/core/clients/s3";
import db from "@/core/db";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const session = await getSession({ req });
  let modelStatus = "not_created";

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  if (req.method === "GET") {
    if (project?.replicateModelId) {
      const response = await replicateClient.get(
        `/v1/trainings/${project.replicateModelId}`
      );

      modelStatus = response?.data?.status || modelStatus;
    }

    return res.json({ project, modelStatus });
  } else if (req.method === "DELETE") {
    const { imageUrls, id } = project;

    // Delete training image
    for (const imageUrl of imageUrls) {
      const key = imageUrl.split(
        `https://${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/`
      )[1];

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: key,
        })
      );
    }

    // Delete zip
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_UPLOAD_BUCKET,
        Key: `${project.id}.zip`,
      })
    );

    // Delete shots and project
    await db.shot.deleteMany({ where: { projectId: id } });
    await db.project.delete({ where: { id } });

    return res.json({ success: true });
  }

  return res.status(405).json({ message: "Method not allowed" });
};

export default handler;
