import PageContainer from "@/components/layout/PageContainer";
import PromptPanel from "@/components/projects/PromptPanel";
import ShotsList from "@/components/projects/shot/ShotsList";
import ProjectProvider, { PROJECTS_PER_PAGE } from "@/contexts/project-context";
import db from "@/core/db";
import { Box, Button } from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import superjson from "superjson";

export type ProjectWithShots = Project & {
  shots: Shot[];
};

export interface IStudioPageProps {
  project: ProjectWithShots & { _count: { shots: number } };
}

const StudioPage = ({ project }: IStudioPageProps) => (
  <ProjectProvider project={project}>
    <PageContainer>
      <Box mb={4}>
        <Button
          color="blackAlpha.500"
          leftIcon={<HiArrowLeft />}
          variant="link"
          href="/dashboard"
          as={Link}
        >
          Back to Dashboard
        </Button>
      </Box>
      <PromptPanel />
      <ShotsList />
    </PageContainer>
  </ProjectProvider>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });
  const projectId = context.query.id as string;

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId, modelStatus: "succeeded" },
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
    return {
      notFound: true,
    };
  }

  const { json: serializedProject } = superjson.serialize(project);

  return {
    props: {
      project: serializedProject,
    },
  };
}

export default StudioPage;
