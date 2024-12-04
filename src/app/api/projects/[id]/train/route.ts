import { replicate } from "@/core/clients/replicate";
import db from "@/core/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  let project = await db.project.findFirstOrThrow({
    where: {
      id: projectId,
      userId: session.userId,
      modelStatus: "not_created",
      NOT: { stripePaymentId: null },
    },
  });

  await replicate.models.create(process.env.REPLICATE_USERNAME!, project.id, {
    description: project.id,
    visibility: "private",
    hardware: "gpu-t4",
  });

  const training = await replicate.trainings.create(
    "ostris",
    "flux-dev-lora-trainer",
    "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
    {
      destination: `${process.env.REPLICATE_USERNAME}/${project.id}`,
      input: {
        trigger_word: process.env.NEXT_PUBLIC_REPLICATE_INSTANCE_TOKEN,
        input_images: `https://${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com/${project.id}.zip`,
        //max_train_steps: Number(process.env.REPLICATE_MAX_TRAIN_STEPS || 3000),
        //num_class_images: 200,
        //learning_rate: 1e-6,
        webhook: `${process.env.NEXTAUTH_URL}/api/webhooks/completed`,
      },
    }
  );

  project = await db.project.update({
    where: { id: project.id },
    data: {
      replicateModelId: training.id,
      modelStatus: "processing",
    },
  });

  return NextResponse.json({ project });
}
