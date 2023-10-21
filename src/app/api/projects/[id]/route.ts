import s3Client from "@/core/clients/s3";
import db from "@/core/db";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const projectId = params.id;

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  let modelStatus = "not_created";

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  return NextResponse.json({ project, modelStatus });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const projectId = params.id;

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

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

  return NextResponse.json({ success: true });
}
