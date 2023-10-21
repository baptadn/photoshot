import StudioPage from "@/components/pages/StudioPage";
import replicateClient from "@/core/clients/replicate";
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

  const { data: model } = await replicateClient.get(
    `https://api.replicate.com/v1/models/${process.env.REPLICATE_USERNAME}/${project.id}/versions/${project.modelVersionId}`
  );

  const hasImageInputAvailable = Boolean(
    model.openapi_schema?.components?.schemas?.Input?.properties?.image?.title
  );

  return (
    <StudioPage
      project={project}
      hasImageInputAvailable={hasImageInputAvailable}
    />
  );
};

export default Studio;
