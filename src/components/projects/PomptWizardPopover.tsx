import useProjectContext from "@/hooks/use-project-context";
import {
  Badge,
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaMagic } from "react-icons/fa";
import { useMutation } from "react-query";

const PomptWizardPopover = () => {
  const { query } = useRouter();
  const { promptInputRef, updatePromptWizardCredits, promptWizardCredits } =
    useProjectContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keyword, setKeyword] = useState<string>("");

  const { mutate: createPrompt, isLoading: isLoadingPrompt } = useMutation(
    "create-prompt",
    (keyword: string) =>
      axios.post(`/api/projects/${query.id}/prompter`, {
        keyword,
      }),
    {
      onSuccess: (response) => {
        const { prompt } = response.data;
        promptInputRef.current!.value = prompt;
        updatePromptWizardCredits(response.data.promptWizardCredits);
        setKeyword("");
        onClose();
      },
    }
  );

  return (
    <>
      <Button
        rightIcon={<FaMagic />}
        variant="outline"
        size="sm"
        onClick={onOpen}
      >
        <Badge colorScheme="yellow" mr={1}>
          New
        </Badge>
        Prompt Wizard
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="auto" backdropBlur="4px" />
        <ModalContent
          onSubmit={(e) => {
            e.preventDefault();

            if (keyword) {
              createPrompt(keyword);
            }
          }}
          as="form"
        >
          <ModalHeader>Prompt Wizard</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              Enter a <b>topic or concept</b> and our AI will generate a good
              prompt example based on it:
            </Text>
            <Input
              autoFocus
              placeholder="Cowboy, Pirate, Jedi, Zombie…"
              value={keyword}
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />
            <Text textAlign="right" width="100%" mt={1} fontSize="sm">
              <b>{promptWizardCredits}</b> prompt assist
              {promptWizardCredits && "s"} left
            </Text>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                disabled={promptWizardCredits === 0}
                variant="brand"
                rightIcon={<FaMagic />}
                isLoading={isLoadingPrompt}
                type="submit"
              >
                Generate
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PomptWizardPopover;
