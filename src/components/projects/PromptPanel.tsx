import BuyShotButton from "@/components/projects/shot/BuyShotButton";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
import useProjectContext from "@/hooks/use-project-context";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link as ChakraLink,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { BsLightbulb } from "react-icons/bs";
import { FaMagic } from "react-icons/fa";
import { useMutation } from "react-query";

const PromptPanel = () => {
  const {
    project,
    shotCredits,
    addShot,
    updateCredits,
    shotTemplate,
    updateShotTemplate,
    promptInputRef,
  } = useProjectContext();

  const { mutate: createPrediction, isLoading: isCreatingPrediction } =
    useMutation(
      "create-prediction",
      (project: Project) =>
        axios.post<{ shot: Shot }>(`/api/projects/${project.id}/predictions`, {
          prompt: promptInputRef.current!.value,
          seed: shotTemplate?.seed,
        }),
      {
        onSuccess: (response) => {
          addShot(response.data.shot);
          promptInputRef.current!.value = "";
        },
      }
    );

  return (
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
            updateCredits(credits);
          }}
        />
      </Text>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 2 }}
        my={6}
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (promptInputRef.current!.value) {
            createPrediction(project);
            updateShotTemplate(undefined);
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
          isLoading={isCreatingPrediction}
        >
          {shotCredits === 0 ? "No more shot" : "Generate"}
        </Button>
      </Flex>
      {shotTemplate ? (
        <HStack
          mx={3}
          my={3}
          alignItems="flex-start"
          position="relative"
          overflow="hidden"
        >
          <Image
            style={{ borderRadius: 5 }}
            placeholder="blur"
            blurDataURL={shotTemplate.blurhash || "placeholder"}
            unoptimized
            alt={shotTemplate.prompt}
            src={shotTemplate.outputUrl!}
            width={48}
            height={48}
          />
          <Text fontSize="md">
            The new shot will use <b>the same style</b> as this image (using the
            same seed)
            <br />
            <Button
              onClick={() => {
                updateShotTemplate(undefined);
              }}
              size="sm"
              variant="link"
              colorScheme="red"
            >
              Remove
            </Button>
          </Text>
        </HStack>
      ) : (
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
      )}
    </Box>
  );
};

export default PromptPanel;
