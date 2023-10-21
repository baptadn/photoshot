import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import replicateClient from "@/core/clients/replicate";
import db from "@/core/db";
import { replacePromptToken } from "@/core/utils/predictions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { prompt, seed, image } = body;

  const projectId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  if (project.credits < 1) {
    return NextResponse.json({ message: "No credit" }, { status: 400 });
  }

  const { data } = await replicateClient.post(
    `https://api.replicate.com/v1/predictions`,
    {
      input: {
        prompt: replacePromptToken(prompt, project),
        negative_prompt:
          process.env.REPLICATE_NEGATIVE_PROMPT ||
          "cropped face, cover face, cover visage, mutated hands",
        ...(image && { image }),
        ...(seed && { seed }),
      },
      version: project.modelVersionId,
    }
  );

  const shot = await db.shot.create({
    data: {
      prompt,
      replicateId: data.id,
      status: "starting",
      projectId: project.id,
    },
  });

  await db.project.update({
    where: { id: project.id },
    data: {
      credits: project.credits - 1,
    },
  });

  return NextResponse.json({ shot });
}
