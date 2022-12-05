import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import uniqid from "uniqid";
import { createZipFolder } from "@/core/utils/assets";
import s3Client from "@/core/clients/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import replicateClient from "@/core/clients/replicate";
import urlSlug from "url-slug";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "POST") {
    const urls = req.body.urls as string[];
    const instanceName = req.body.instanceName as string;
    const instanceClass = req.body.instanceClass as string;

    const project = await db.project.create({
      data: {
        imageUrls: urls,
        name: uniqid(),
        userId: session.userId,
        modelStatus: "not_created",
        instanceClass: instanceClass || "person",
        instanceName: urlSlug(instanceName, { separator: "" }),
        credits: Number(process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT) || 50,
      },
    });

    const buffer = await createZipFolder(urls, project);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_UPLOAD_BUCKET!,
        Key: `${project.name}.zip`,
        Body: buffer,
      })
    );

    return res.json({ project });
  }

  if (req.method === "GET") {
    const projects = await db.project.findMany({
      where: { userId: session.userId },
      include: { shots: { take: 10, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    for (const project of projects) {
      if (project?.replicateModelId && project?.modelStatus !== "succeeded") {
        const { data } = await replicateClient.get(
          `/v1/trainings/${project.replicateModelId}`
        );

        await db.project.update({
          where: { id: project.id },
          data: { modelVersionId: data.version, modelStatus: data?.status },
        });
      }
    }

    return res.json(projects);
  }
};

export default handler;
