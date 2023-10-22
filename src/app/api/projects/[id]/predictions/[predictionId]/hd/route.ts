import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import replicateClient from "@/core/clients/replicate";
import db from "@/core/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string; predictionId: string } }
) {
  const projectId = params.id;
  const predictionId = params.predictionId;

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

  if (shot.hdStatus !== "PENDING") {
    return NextResponse.json(
      { message: "4K already applied" },
      { status: 400 }
    );
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

  return NextResponse.json({ shot });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; predictionId: string } }
) {
  const projectId = params.id;
  const predictionId = params.predictionId;

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

  if (shot.hdStatus !== "NO") {
    return NextResponse.json(
      { message: "4K already applied" },
      { status: 400 }
    );
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

  return NextResponse.json({ shot });
}
