import TiltImage from "@/components/home/TiltImage";
import PageContainer from "@/components/layout/PageContainer";
import { prompts } from "@/core/utils/prompts";
import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaMagic } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { description } from "..";

export type TPrompt = typeof prompts[number];

const PromptPage = ({
  prompt,
  morePrompts,
}: {
  prompt: TPrompt;
  morePrompts: TPrompt[];
}) => {
  const { hasCopied, onCopy } = useClipboard(prompt.prompt);

  return (
    <PageContainer>
      <Head>
        <title>{`Free prompt ${prompt.label} - Photoshot`}</title>
        <meta name="description" content={description} key="description" />
      </Head>
      <Box mb={4}>
        <Button
          color="beige.500"
          leftIcon={<HiArrowLeft />}
          variant="link"
          href="/prompts"
          as={Link}
        >
          Back to prompts
        </Button>
      </Box>
      <Flex
        flexDirection="column"
        borderRadius="xl"
        p={{ base: 6, md: 10 }}
        pt={8}
        backgroundColor="white"
        alignItems="flex-start"
      >
        <VStack spacing={0} alignItems="flex-start">
          <Text
            textTransform="capitalize"
            fontWeight="extrabold"
            fontSize={{ base: "2xl", md: "3xl" }}
            as="h1"
          >
            {prompt?.label} avatar prompt
          </Text>
          <Text fontSize={{ base: "md", md: "xl" }} as="h2">
            Become the {prompt?.label} with our free AI prompt
          </Text>
        </VStack>
        <Flex
          flexDirection={{ base: "column-reverse", sm: "row" }}
          mt={{ base: 4, md: 10 }}
          width="100%"
          gap={4}
        >
          <Flex
            flex="1"
            alignItems={{ base: "center", md: "flex-start" }}
            flexDirection={{ base: "column", md: "row" }}
            gap={4}
          >
            <TiltImage size="100%" character="romy" slug={prompt.slug} />
            <TiltImage size="100%" character="sacha" slug={prompt.slug} />
          </Flex>
          <VStack flex="1" spacing={5}>
            <Text fontFamily="mono">{prompt.prompt}</Text>
            <HStack justifyContent="flex-end" width="100%" textAlign="right">
              <Button onClick={onCopy} variant="ghost" colorScheme="beige">
                {hasCopied ? "Copied!" : "Copy prompt"}
              </Button>
              <Button
                variant="brand"
                textTransform="capitalize"
                href="/dashboard"
                as={Link}
                rightIcon={<FaMagic />}
              >
                Use prompt
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Flex>
      <VStack alignItems="flex-start" overflow="hidden" my={10}>
        <Text fontWeight="bold" fontSize="2xl">
          More AI Prompts
        </Text>
        <SimpleGrid
          columns={{ base: 2, sm: 3, md: 4, lg: 5 }}
          width="100%"
          marginX="auto"
        >
          {morePrompts.map((prompt, i) => (
            <Link
              key={prompt.label}
              href={`/prompts/dreambooth/${prompt.slug}`}
            >
              <VStack p={2} spacing={1} alignItems="flex-start">
                <TiltImage
                  size="100%"
                  character={i % 2 ? "sacha" : "romy"}
                  slug={prompt.slug}
                />
                <Text
                  color="beige.500"
                  fontWeight="semibold"
                  textTransform="capitalize"
                >
                  {prompt.label}
                </Text>
              </VStack>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    </PageContainer>
  );
};

export async function getStaticPaths() {
  return {
    paths: prompts.map((prompt) => ({ params: { slug: prompt.slug } })),
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const slug = context.params?.slug as string;
  const promptIndex = prompts.findIndex((prompt) => prompt.slug === slug)!;
  const prompt = prompts[promptIndex];

  const morePrompts: TPrompt[] = [];

  for (let i = promptIndex + 1; i < promptIndex + 6; i++) {
    if (i > prompts.length - 1) {
      morePrompts.push(prompts[Math.abs(i - prompts.length)]);
    } else {
      morePrompts.push(prompts[i]);
    }
  }

  return {
    props: { prompt, morePrompts },
  };
}

export default PromptPage;
