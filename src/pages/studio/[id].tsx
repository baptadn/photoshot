import PageContainer from "@/components/layout/PageContainer";
import BuyShotButton from "@/components/projects/shot/BuyShotButton";
import ShotCard from "@/components/projects/shot/ShotCard";
import db from "@/core/db";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
import {
  Box,
  Button,
  Flex,
  Icon,
  Link as ChakraLink,
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BsLightbulb } from "react-icons/bs";
import { FaMagic } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { useMutation, useQuery } from "react-query";
import superjson from "superjson";

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
      <Box
        borderRadius="xl"
        p={{ base: 5, md: 7 }}
        mb={10}
        backgroundColor="white"
      >
        <Text fontSize="2xl" fontWeight="semibold">
          Studio <b>{project.instanceName}</b>{" "}
          <BuyShotButton
            credits={shotCredits}
            onPaymentSuccess={(credits: number) => {
              setShotCredits(credits);
            }}
          />
        </Text>
        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          gap={{ base: 4, md: 2 }}
          my={6}
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
            disabled={shotCredits === 0}
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
            disabled={shotCredits === 0}
            type="submit"
            size="lg"
            variant="brand"
            rightIcon={<FaMagic />}
            isLoading={isLoading}
          >
            {shotCredits === 0 ? "No more shot" : "Generate"}
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
      </Box>

      {shots.length === 0 ? (
        <Box textAlign="center" fontSize="lg">
          {`You don't have any prompt yet. It's time to be creative!`}
        </Box>
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            spacing={10}
            alignItems="flex-start"
          >
            {shots.map((shot: Shot) => (
              <ShotCard key={shot.id} shot={shot} />
            ))}
          </SimpleGrid>
          {hasMoreResult && (
            <Box mt={4} textAlign="center" width="100%">
              <Button
                isLoading={isLoadingMore}
                variant="brand"
                onClick={() => {
                  refetch();
                }}
              >
                Load more
              </Button>
            </Box>
          )}
        </>
      )}
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
