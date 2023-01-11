import { prompts } from "@/core/utils/prompts";
import useProjectContext from "@/hooks/use-project-context";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { FaMagic } from "react-icons/fa";
import PromptWizardPanel from "./PromptWizardPanel";

const PromptsDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { promptInputRef } = useProjectContext();

  return (
    <>
      <Button
        rightIcon={<FaMagic />}
        variant="outline"
        size="sm"
        onClick={onOpen}
      >
        Prompt Assistant
      </Button>
      <Drawer
        isOpen={isOpen}
        size={{ base: "md", md: "lg" }}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Prompt Assistant</DrawerHeader>
          <DrawerBody>
            <VStack
              alignItems="flex-start"
              width="100%"
              divider={<Divider />}
              spacing={6}
            >
              <PromptWizardPanel onClose={onClose} />
              <Box>
                <Text mb={4}>Or select a preset:</Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
                  {prompts.map((prompt) => (
                    <Box
                      cursor="pointer"
                      key={prompt.slug}
                      transition="200ms all"
                      _hover={{ filter: "contrast(140%)" }}
                    >
                      <Image
                        onClick={() => {
                          promptInputRef.current!.value = prompt.prompt;
                          onClose();
                        }}
                        style={{ borderRadius: 10 }}
                        src={`/prompts/sacha/${prompt.slug}.png`}
                        alt={prompt.label}
                        width="400"
                        height="400"
                      />
                      <Text
                        textTransform="capitalize"
                        fontWeight="semibold"
                        color="beige.500"
                        mt={1}
                      >
                        {prompt.label}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PromptsDrawer;
