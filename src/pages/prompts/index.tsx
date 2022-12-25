import CharacterSwitcher, {
  TCharacter,
} from "@/components/home/CharacterSwitcher";
import TiltImage from "@/components/home/TiltImage";
import PageContainer from "@/components/layout/PageContainer";
import { prompts } from "@/core/utils/prompts";
import { Button, Divider, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";

const title = "AI Prompts Inspiration";
export const description =
  "Our free AI prompt covers a wide range of themes and topics to help you create a unique avatar. Use theme with our Studio or your Stable Diffusion or Dreambooth models.";

const Prompts = () => {
  const [character, setCharacter] = useState<TCharacter>("romy");

  return (
    <PageContainer>
      <Head>
        <title>{title} - Photoshot</title>
        <meta name="description" content={description} />
      </Head>
      <VStack
        borderRadius="xl"
        width="100%"
        mb={10}
        flex="1"
        alignItems="flex-start"
      >
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="extrabold"
          as="h1"
        >
          {title}
        </Text>
        <Text
          color="beige.500"
          maxWidth="container.md"
          fontSize={{ base: "lg", md: "xl" }}
          as="h2"
        >
          {description}
        </Text>
      </VStack>

      <Flex
        position="relative"
        alignItems="space-between"
        flexDirection={{ base: "column", md: "row-reverse" }}
      >
        <Flex mb={10} justifyContent="center" flex="1">
          <CharacterSwitcher
            onCharacterChange={(character) => {
              setCharacter(character);
            }}
          />
        </Flex>
        <VStack flex="2" spacing={2} divider={<Divider />}>
          {prompts.map((prompt) => (
            <Flex
              key={prompt.label}
              p={4}
              gap={4}
              borderRadius="xl"
              backgroundColor="white"
            >
              <TiltImage character={character} slug={prompt.slug} />
              <VStack justifyContent="space-between" alignItems="flex-start">
                <VStack alignItems="flex-start">
                  <Text
                    textTransform="capitalize"
                    fontWeight="bold"
                    fontSize={{ base: "xl", md: "2xl" }}
                    as="h3"
                  >
                    {prompt.label} prompt
                  </Text>
                  <Text
                    noOfLines={3}
                    fontSize="sm"
                    fontFamily="mono"
                    color="beige.700"
                  >
                    {prompt.prompt}
                  </Text>
                </VStack>
                <HStack
                  justifyContent="flex-end"
                  width="100%"
                  textAlign="right"
                >
                  <Button
                    colorScheme="beige"
                    variant="outline"
                    rightIcon={<BsArrowRight />}
                    href={`/prompts/dreambooth/${prompt.slug}`}
                    as={Link}
                    size="sm"
                  >
                    View
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </PageContainer>
  );
};

export default Prompts;
