import StudioPage from "@/components/pages/StudioPage";
import db from "@/core/db";
import { getCurrentSessionRedirect } from "@/lib/sessions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const PROJECTS_PER_PAGE = 9;

export const metadata: Metadata = {
  title: "My Studio",
};

const Studio = async ({ params }: { params: { id: string } }) => {
  const session = await getCurrentSessionRedirect();
  const projectId = params.id;

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: session.userId,
      modelStatus: "succeeded",
    },
    include: {
      _count: {
        select: { shots: true },
      },
      shots: {
        orderBy: { createdAt: "desc" },
        take: PROJECTS_PER_PAGE,
        skip: 0,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    notFound();
  }

  return <StudioPage project={project} />;
};

export default Studio;
