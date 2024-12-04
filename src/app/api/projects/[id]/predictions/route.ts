import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import openai from "@/core/clients/openai";
import { replicate } from "@/core/clients/replicate";
import db from "@/core/db";
import { replacePromptToken } from "@/core/utils/predictions";
import { prompts } from "@/core/utils/prompts";
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

  const instruction = `${process.env.OPENAI_API_SEED_PROMPT}

${prompts.slice(0, 5).map(
  (style) => `${style.label}: ${style.prompt}

`
)}

Keyword: ${prompt}
`;

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: instruction }],
    model: "gpt-4-turbo",
    temperature: 0.5,
    max_tokens: 200,
  });

  let refinedPrompt = chatCompletion.choices?.[0]?.message?.content?.trim();

  const prediction = await replicate.predictions.create({
    model: `${process.env.REPLICATE_USERNAME}/${project.id}`,
    version: project.modelVersionId!,
    input: {
      prompt: `${replacePromptToken(
        `${refinedPrompt}. This a portrait of ${project.instanceName} @me and not another person.`,
        project
      )}`,
      negative_prompt:
        process.env.REPLICATE_NEGATIVE_PROMPT ||
        "cropped face, cover face, cover visage, mutated hands",
      ...(image && { image }),
      ...(seed && { seed }),
    },
  });

  const shot = await db.shot.create({
    data: {
      prompt,
      replicateId: prediction.id,
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
