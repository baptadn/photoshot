import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import replicateClient from "@/core/clients/replicate";
import db from "@/core/db";
import { extractSeedFromLogs } from "@/core/utils/predictions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function GET(
  request: Request,
  { params }: { params: { id: string; predictionId: string } }
) {
  const projectId = params.id as string;
  const predictionId = params.predictionId as string;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  let shot = await db.shot.findFirstOrThrow({
    where: { projectId: project.id, id: predictionId },
  });

  const { data: prediction } = await replicateClient.get(
    `https://api.replicate.com/v1/predictions/${shot.replicateId}`
  );

  const outputUrl = prediction.output?.[0];
  let blurhash = null;

  if (outputUrl) {
    const { base64 } = await getPlaiceholder(outputUrl, { size: 16 });
    blurhash = base64;
  }

  const seedNumber = extractSeedFromLogs(prediction.logs);

  shot = await db.shot.update({
    where: { id: shot.id },
    data: {
      status: prediction.status,
      outputUrl: outputUrl || null,
      blurhash,
      seed: seedNumber || null,
    },
  });

  return NextResponse.json({ shot });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; predictionId: string } }
) {
  const projectId = params.id as string;
  const predictionId = params.predictionId as string;

  const body = await request.json();
  const { bookmarked } = body;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  let shot = await db.shot.findFirstOrThrow({
    where: { projectId: project.id, id: predictionId },
  });

  shot = await db.shot.update({
    where: { id: shot.id },
    data: {
      bookmarked: bookmarked || false,
    },
  });

  return NextResponse.json({ shot });
}
