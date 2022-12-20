import BuyShotButton from "@/components/projects/shot/BuyShotButton";
import { getRefinedStudioName } from "@/core/utils/projects";
import useProjectContext from "@/hooks/use-project-context";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { BsLightbulb } from "react-icons/bs";
import { FaCameraRetro } from "react-icons/fa";
import { useMutation } from "react-query";
import PomptWizardPopover from "./PomptWizardPopover";

const PromptPanel = () => {
  const {
    project,
    shotCredits,
    addShot,
    updateCredits,
    shotTemplate,
    updateShotTemplate,
    promptInputRef,
    updatePromptWizardCredits,
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
    <Flex
      as="form"
      flexDirection="column"
      onSubmit={(e) => {
        e.preventDefault();
        if (promptInputRef.current!.value) {
          createPrediction(project);
          updateShotTemplate(undefined);
        }
      }}
      borderRadius="xl"
      p={{ base: 5, md: 7 }}
      mb={10}
      backgroundColor="white"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="semibold">
          Studio <b>{getRefinedStudioName(project)}</b>{" "}
          <BuyShotButton
            credits={shotCredits}
            onPaymentSuccess={(credits, promptWizardCredits) => {
              updateCredits(credits);
              updatePromptWizardCredits(promptWizardCredits);
            }}
          />
        </Text>
      </Flex>
      <Box mt={2}>
        <PomptWizardPopover />
      </Box>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 2 }}
        my={4}
        width="100%"
      >
        <Box flex="1">
          <Textarea
            size="lg"
            disabled={shotCredits === 0}
            ref={promptInputRef}
            backgroundColor="white"
            isRequired
            shadow="lg"
            height="7rem"
            focusBorderColor="gray.400"
            _focus={{ shadow: "md" }}
            mr={2}
            placeholder="a portrait of @me as an astronaut, highly-detailed, trending on artstation"
          />
        </Box>
      </Flex>

      <Flex gap={2} flexDirection={{ base: "column", sm: "row" }}>
        {shotTemplate ? (
          <HStack
            flex="1"
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
              The new shot will use <b>the same style</b> as this image (using
              the same seed)
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
          <Box flex="1">
            <VStack alignItems="flex-start">
              <Text color="beige.500" fontSize="sm">
                <Icon as={BsLightbulb} /> Use <b>@me</b> as the subject of your
                prompt
              </Text>
            </VStack>
          </Box>
        )}
        <Button
          disabled={shotCredits === 0}
          type="submit"
          size="lg"
          variant="brand"
          rightIcon={<FaCameraRetro />}
          isLoading={isCreatingPrediction}
        >
          {shotCredits === 0 ? "No more shot" : "Shoot"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default PromptPanel;
