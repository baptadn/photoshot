import { Box, Flex, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

const ProjectCardSkeleton = () => (
  <Box
    backgroundColor="white"
    width="100%"
    pt={4}
    pb={10}
    px={5}
    borderRadius="xl"
    shadow="lg"
  >
    <VStack spacing={4} alignItems="flex-start">
      <Flex width="100%">
        <Box flex="1">
          <Skeleton mb={2} height="25px" maxWidth="10rem" />
          <Skeleton height="15px" maxWidth="6rem" />
        </Box>
      </Flex>
      <Box width="100%" maxWidth="20rem">
        <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="3" />
      </Box>
    </VStack>
  </Box>
);

export default ProjectCardSkeleton;
