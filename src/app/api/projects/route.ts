import replicateClient from "@/core/clients/replicate";
import s3Client from "@/core/clients/s3";
import db from "@/core/db";
import { createZipFolder } from "@/core/utils/assets";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

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

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const body = await request.json();
  const { urls, studioName, instanceClass } = body;

  const project = await db.project.create({
    data: {
      imageUrls: urls,
      name: studioName,
      userId: session.userId,
      modelStatus: "not_created",
      instanceClass: instanceClass || "person",
      instanceName: process.env.NEXT_PUBLIC_REPLICATE_INSTANCE_TOKEN!,
      credits: Number(process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT) || 50,
    },
  });

  const buffer = await createZipFolder(urls, project);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_UPLOAD_BUCKET!,
      Key: `${project.id}.zip`,
      Body: buffer,
    })
  );

  return NextResponse.json(project);
}
