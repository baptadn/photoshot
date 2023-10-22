"use client";

import { Flex, Slider } from "@chakra-ui/react";
import Features from "../home/Features";
import Hero from "../home/Hero";
import Pricing from "../home/Pricing";

const HomePage = () => (
  <>
    <Flex flexDirection="column" marginX="auto" flex="1">
      <Hero />
    </Flex>
    <Slider />
    <Features />
    <Flex px={4} py={10} maxWidth="container.lg" width="100%" marginX="auto">
      <Pricing />
    </Flex>
  </>
);

export default HomePage;
