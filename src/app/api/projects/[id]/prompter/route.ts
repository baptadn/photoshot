import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import openai from "@/core/clients/openai";
import db from "@/core/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  let project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  const body = await request.json();
  const { keyword } = body;

  if (project.promptWizardCredits < 1) {
    return NextResponse.json(
      { success: false, message: "no_credit" },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      prompt: `${process.env.OPENAI_API_SEED_PROMPT}

${keyword}:`,
    });

    const prompt = completion.data.choices?.[0].text!.trim();

    if (prompt) {
      project = await db.project.update({
        where: { id: project.id },
        data: {
          promptWizardCredits: project.promptWizardCredits - 1,
        },
      });
    }

    return NextResponse.json({
      prompt,
      promptWizardCredits: project.promptWizardCredits,
    });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
