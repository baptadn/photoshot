"use client";

import PageContainer from "@/components/layout/PageContainer";
import PromptPanel from "@/components/projects/PromptPanel";
import ShotsList from "@/components/projects/shot/ShotsList";
import ProjectProvider from "@/contexts/project-context";
import { Box, Button } from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

export type ProjectWithShots = Project & {
  shots: Shot[];
};

export interface IStudioPageProps {
  project: ProjectWithShots & { _count: { shots: number } };
  hasImageInputAvailable: boolean;
}

const StudioPage = ({ project, hasImageInputAvailable }: IStudioPageProps) => (
  <ProjectProvider project={project}>
    <PageContainer>
      <Box mb={4}>
        <Button
          color="beige.500"
          leftIcon={<HiArrowLeft />}
          variant="link"
          href="/dashboard"
          as={Link}
        >
          Back to Dashboard
        </Button>
      </Box>
      <PromptPanel hasImageInputAvailable={hasImageInputAvailable} />
      <ShotsList />
    </PageContainer>
  </ProjectProvider>
);

export default StudioPage;
