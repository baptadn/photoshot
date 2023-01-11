import useProjectContext from "@/hooks/use-project-context";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaMagic } from "react-icons/fa";
import { useMutation } from "react-query";

const PromptWizardPanel = ({ onClose }: { onClose: () => void }) => {
  const { query } = useRouter();
  const { promptInputRef, updatePromptWizardCredits, promptWizardCredits } =
    useProjectContext();
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
    <VStack
      as="form"
      maxWidth="30rem"
      alignItems="flex-start"
      flexDirection="column"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (keyword) {
          createPrompt(keyword);
        }
      }}
    >
      <Text mb={2}>
        Enter a <b>topic or concept</b> and our AI will generate a good prompt
        example based on it:
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

      <Button
        disabled={promptWizardCredits === 0}
        variant="brand"
        rightIcon={<FaMagic />}
        isLoading={isLoadingPrompt}
        type="submit"
      >
        Generate
      </Button>
    </VStack>
  );
};

export default PromptWizardPanel;
