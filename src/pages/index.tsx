import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import { Box, Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Flex flexDirection="column" marginX="auto" flex="1">
        <Hero />
      </Flex>
      <Features />
      <Flex px={4} py={10} maxWidth="container.lg" width="100%" marginX="auto">
        <Pricing />
      </Flex>
    </>
  );
}
