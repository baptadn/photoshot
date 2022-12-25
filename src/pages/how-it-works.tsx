import PageContainer from "@/components/layout/PageContainer";
import { Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

const HowItWorks = () => {
  return (
    <PageContainer maxWidth="container.md">
      <Head>
        <title>AI Avatar: how it works - Photoshot</title>
      </Head>

      <VStack
        alignItems="flex-start"
        borderRadius="xl"
        p={10}
        backgroundColor="white"
        spacing={4}
      >
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="extrabold"
          as="h1"
        >
          AI Avatar: how it works?
        </Text>
        <Text>
          Have you heard of Dreambooth? {"It's"} a new AI tool that uses the
          stable diffusion model to create avatars that look just like you! The
          stable diffusion model is a type of generative model that is used to
          create images that are realistic and visually appealing.
        </Text>
        <Text>
          It works by diffusing the generated images through a series of
          filters, which smooth out the image and make it more lifelike. This
          process is repeated multiple times, with the generated images becoming
          increasingly smooth and realistic with each iteration. Dreambooth uses
          the stable diffusion model to create avatars that look like you, based
          on a set of input data.
        </Text>
        <Text>
          {"It's"} trained on a large dataset of images, and uses this training
          to generate new images that are similar to the ones in the dataset.
          The discriminator is used to determine whether the generated images
          are real or fake. One of the benefits of Dreambooth is that it can
          create high-quality avatars with relatively little training data. This
          makes it a great option for situations where there is a limited amount
          of data available, or when the data is too large to be processed by
          traditional generative models.
        </Text>
        <Text>
          Overall, Dreambooth is a powerful AI tool that uses the stable
          diffusion model to create avatars that look just like you. Its use of
          diffusion to smooth out and refine the generated images makes it an
          effective and efficient alternative to traditional generative models.
          So, it has the potential to revolutionize the way we create avatars
          and could have a wide range of applications in fields such as computer
          graphics, machine learning, and more.
        </Text>
      </VStack>
    </PageContainer>
  );
};

export default HowItWorks;
