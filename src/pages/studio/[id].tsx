import PageContainer from "@/components/layout/PageContainer";
import ShotCard from "@/components/projects/ShotCard";
import db from "@/core/db";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useMutation } from "react-query";
import superjson from "superjson";
import { FaMagic } from "react-icons/fa";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { BsLightbulb } from "react-icons/bs";
import { getRefinedInstanceClass } from "@/core/utils/predictions";

export type ProjectWithShots = Project & {
  shots: Shot[];
};

interface IStudioPageProps {
  project: ProjectWithShots;
}

const StudioPage = ({ project }: IStudioPageProps) => {
  const [prompt, setPrompt] = useState("");
  const [shots, setShots] = useState(project.shots);
  const [shotCredits, setShotCredits] = useState(project.credits);

  const { mutate: createPrediction, isLoading } = useMutation(
    "create-prediction",
    (project: Project) =>
      axios.post<{ shot: Shot }>(`/api/projects/${project.id}/predictions`, {
        prompt,
      }),
    {
      onSuccess: (response) => {
        const shot = response.data.shot;

        setShots([shot, ...shots]);
        setShotCredits(shotCredits - 1);
        setPrompt("");
      },
    }
  );

  return (
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
      <Box borderRadius="xl" p={{ base: 5, md: 10 }} backgroundColor="white">
        <Text fontSize="2xl" fontWeight="semibold">
          Studio <b>{project.instanceName}</b>{" "}
          <Badge colorScheme="teal">{shotCredits} shots left</Badge>
        </Text>
        <Text textTransform="capitalize" fontSize="sm">
          {formatRelative(new Date(project.createdAt), new Date())}
        </Text>

        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          gap={2}
          mt={10}
          mb={4}
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (prompt) {
              createPrediction(project);
            }
          }}
          width="100%"
        >
          <Input
            backgroundColor="white"
            isRequired
            size="lg"
            shadow="lg"
            mr={2}
            type="text"
            placeholder={`painting of ${project.instanceName} ${project.instanceClass} by Andy Warhol`}
            value={prompt}
            onChange={(e) => setPrompt(e.currentTarget.value)}
          />
          <Button
            type="submit"
            size="lg"
            variant="brand"
            rightIcon={<FaMagic />}
            isLoading={isLoading}
          >
            Generate
          </Button>
        </Flex>
        <Text fontSize="md">
          <Icon as={BsLightbulb} /> Use the keyword{" "}
          <b>
            {project.instanceName}{" "}
            {getRefinedInstanceClass(project.instanceClass)}
          </b>{" "}
          as the subject in your prompt. First prompt can be slow, but following
          prompts will be faster.
        </Text>
        <Divider mt={10} mb={4} />
        {shots.length === 0 ? (
          <Box textAlign="center" fontSize="lg">
            {`You don't have any prompt yet. It's time to be creative!`}
          </Box>
        ) : (
          <VStack spacing={4} divider={<Divider />} alignItems="flex-start">
            {shots.map((shot: Shot) => (
              <ShotCard key={shot.id} projectId={project.id} shot={shot} />
            ))}
          </VStack>
        )}
      </Box>
    </PageContainer>
  );
};

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
    include: { shots: { orderBy: { createdAt: "desc" } } },
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
