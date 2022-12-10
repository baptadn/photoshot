import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Link,
  Spinner,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { Shot } from "@prisma/client";
import axios from "axios";
import { formatRelative } from "date-fns";
import NextImage from "next/image";
import { memo } from "react";
import Zoom from "react-medium-image-zoom";
import { useQuery } from "react-query";

const ShotCard = ({
  shot: initialShot,
  projectId,
}: {
  shot: Shot;
  projectId: string;
}) => {
  const { onCopy, hasCopied } = useClipboard(initialShot.prompt);

  const { data } = useQuery(
    `shot-${initialShot.id}`,
    () =>
      axios
        .get<{ shot: Shot }>(
          `/api/projects/${projectId}/predictions/${initialShot.id}`
        )
        .then((res) => res.data),
    {
      refetchInterval: (data) => (data?.shot.outputUrl ? false : 5000),
      refetchOnWindowFocus: false,
      enabled: !initialShot.outputUrl,
      initialData: { shot: initialShot },
    }
  );

  const shot = data!.shot;

  return (
    <Box width="100%" p={2}>
      <Flex flex="2">
        {shot.outputUrl ? (
          <Box
            height="100px"
            width="100px"
            backgroundColor="gray.100"
            borderRadius="xl"
            overflow="hidden"
          >
            <Zoom>
              <NextImage
                alt={shot.prompt}
                src={shot.outputUrl}
                width="512"
                height="512"
              />
            </Zoom>
          </Box>
        ) : (
          <Box>
            <Center
              backgroundColor="gray.100"
              width="7rem"
              height="7rem"
              borderRadius="xl"
            >
              <Spinner speed="2s" color="gray.400" />
            </Center>
          </Box>
        )}
        <Flex
          flex="1"
          justifyContent="space-between"
          flexDirection="column"
          ml={4}
        >
          <Box>
            <Text fontWeight="600" fontSize="lg">
              {shot.prompt}
            </Text>
            <Text fontSize="sm">
              {formatRelative(new Date(shot.createdAt), new Date())}
            </Text>
          </Box>

          <HStack mt={4}>
            <Button
              size="sm"
              color="blackAlpha.600"
              variant="link"
              onClick={onCopy}
            >
              {hasCopied ? "Copied" : "Copy prompt"}
            </Button>
            {shot.outputUrl && (
              <>
                <Box>-</Box>
                <Button
                  size="sm"
                  as={Link}
                  href={shot.outputUrl}
                  color="blackAlpha.600"
                  target="_blank"
                  variant="link"
                  onClick={onCopy}
                >
                  Download
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default memo(ShotCard);
