import { prompts } from "@/core/utils/prompts";
import useProjectContext from "@/hooks/use-project-context";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";

const PromptsDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { promptInputRef } = useProjectContext();

  return (
    <>
      <Button variant="outline" size="sm" onClick={onOpen}>
        Prompt Ideas
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
          <DrawerHeader>Select style</DrawerHeader>
          <DrawerBody>
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PromptsDrawer;
