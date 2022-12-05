import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

const PageContainer = (props: FlexProps) => (
  <Flex
    width="100%"
    maxWidth="container.lg"
    flex="1"
    pt={10}
    flexDirection="column"
    marginX="auto"
    px={4}
    {...props}
  />
);

export default PageContainer;
