"use client";

import Uploader from "@/components/dashboard/Uploader";
import PageContainer from "@/components/layout/PageContainer";
import ProjectCard from "@/components/projects/ProjectCard";
import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";
import ProjectCardSkeleton from "../projects/ProjectCardSkeleton";
import { ProjectWithShots } from "./StudioPage";

export default function DashboardPage() {
  const {
    data: projects,
    refetch: refetchProjects,
    isLoading,
  } = useQuery(`projects`, () =>
    axios
      .get<ProjectWithShots[]>("/api/projects")
      .then((response) => response.data)
  );

  return (
    <PageContainer>
      <Box>
        <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
          Create a new Studio
        </Heading>
        <Uploader
          handleOnAdd={() => {
            refetchProjects();
          }}
        />
      </Box>

      <Box mt={10}>
        <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
          My Studios
        </Heading>

        {isLoading && <ProjectCardSkeleton />}

        {!isLoading && projects?.length === 0 && (
          <Center
            p={10}
            borderRadius="xl"
            backgroundColor="white"
            width="100%"
            color="blackAlpha.700"
            textAlign="center"
          >
            <Text backgroundColor="white">No studio available yet</Text>
          </Center>
        )}

        <VStack spacing={10} width="100%">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              handleRefreshProjects={() => {
                refetchProjects();
              }}
            />
          ))}
        </VStack>
      </Box>
    </PageContainer>
  );
}
