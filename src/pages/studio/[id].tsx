import PageContainer from "@/components/layout/PageContainer";
import ShotCard from "@/components/projects/shot/ShotCard";
import db from "@/core/db";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  Textarea,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
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
  project: ProjectWithShots & { _count: { shots: number } };
}

const PER_PAGE = 10;

const StudioPage = ({ project }: IStudioPageProps) => {
  const [shots, setShots] = useState(project.shots);
  const [skip, setSkip] = useState(PER_PAGE);
  const [hasMoreResult, setHasMoreResult] = useState(
    project.shots.length < project._count.shots
  );

  const [shotCredits, setShotCredits] = useState(project.credits);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: createPrediction, isLoading } = useMutation(
    "create-prediction",
    (project: Project) =>
      axios.post<{ shot: Shot }>(`/api/projects/${project.id}/predictions`, {
        prompt: promptInputRef.current!.value,
      }),
    {
      onSuccess: (response) => {
        const shot = response.data.shot;

        setShots([shot, ...shots]);
        setShotCredits(shotCredits - 1);
        setSkip(skip + 1);

        promptInputRef.current!.value = "";
      },
    }
  );

  const { isLoading: isLoadingMore, refetch } = useQuery(
    `shots-${PER_PAGE}-${skip}`,
    () =>
      axios.get<{ shots: Shot[]; shotsCount: number }>(
        `/api/projects/${project.id}/shots?take=${PER_PAGE}&skip=${skip}`
      ),
    {
      enabled: false,
      onSuccess: (response) => {
        const { data } = response;
        setHasMoreResult(shots.length + data.shots.length < data.shotsCount);

        if (data.shots.length) {
          setShots([...shots, ...data.shots]);
          setSkip(skip + PER_PAGE);
        }
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
            if (promptInputRef.current!.value) {
              createPrediction(project);
            }
          }}
          width="100%"
        >
          <Textarea
            ref={promptInputRef}
            backgroundColor="white"
            isRequired
            size="lg"
            shadow="lg"
            focusBorderColor="gray.400"
            _focus={{ shadow: "md" }}
            mr={2}
            placeholder={`a portrait of a ${
              project.instanceName
            } ${getRefinedInstanceClass(
              project.instanceClass
            )} as an astronaut, highly-detailed, trending on artstation`}
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
          as the subject in your prompt. Need prompt inspiration? Check{" "}
          <ChakraLink
            textDecoration="underline"
            isExternal
            href="https://lexica.art/?q=portrait+of+jedi"
          >
            lexica.art
          </ChakraLink>
        </Text>
        <Divider mt={10} mb={4} />
        {shots.length === 0 ? (
          <Box textAlign="center" fontSize="lg">
            {`You don't have any prompt yet. It's time to be creative!`}
          </Box>
        ) : (
          <VStack spacing={4} divider={<Divider />} alignItems="flex-start">
            {shots.map((shot: Shot) => (
              <ShotCard key={shot.id} shot={shot} />
            ))}
            {hasMoreResult && (
              <Button
                isLoading={isLoadingMore}
                variant="brand"
                onClick={() => {
                  refetch();
                }}
              >
                Load more
              </Button>
            )}
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
    include: {
      _count: {
        select: { shots: true },
      },
      shots: { orderBy: { createdAt: "desc" }, take: PER_PAGE, skip: 0 },
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
