import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Link,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { Shot } from "@prisma/client";
import axios from "axios";
import { formatRelative } from "date-fns";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import ShotImage from "./ShotImage";

const ShotCard = ({ shot: initialShot }: { shot: Shot }) => {
  const { onCopy, hasCopied } = useClipboard(initialShot.prompt);
  const { query } = useRouter();
  const [shot, setShot] = useState(initialShot);

  const { mutate: bookmark, isLoading } = useMutation(
    `update-shot-${initialShot.id}`,
    (bookmarked: boolean) =>
      axios.patch<{ shot: Shot }>(
        `/api/projects/${query.id}/predictions/${initialShot.id}`,
        {
          bookmarked,
        }
      ),
    {
      onSuccess: (response) => {
        setShot(response.data.shot);
      },
    }
  );

  useQuery(
    `shot-${initialShot.id}`,
    () =>
      axios
        .get<{ shot: Shot }>(
          `/api/projects/${query.id}/predictions/${initialShot.id}`
        )
        .then((res) => res.data),
    {
      refetchInterval: (data) => (data?.shot.outputUrl ? false : 5000),
      refetchOnWindowFocus: false,
      enabled: !initialShot.outputUrl,
      initialData: { shot: initialShot },
      onSuccess: (response) => {
        setShot(response.shot);
      },
    }
  );

  return (
    <Box
      overflow="hidden"
      backgroundColor="white"
      borderRadius="lg"
      width="100%"
      position="relative"
    >
      {shot.outputUrl ? (
        <ShotImage shot={shot} />
      ) : (
        <Box>
          <AspectRatio ratio={1}>
            <Center backgroundColor="gray.100" width="100%">
              <Spinner speed="2s" color="gray.400" />
            </Center>
          </AspectRatio>
        </Box>
      )}
      <Flex position="relative" p={3} flexDirection="column">
        <Flex alignItems="flex-start" justifyContent="space-between">
          <Text color="blackAlpha.700" fontSize="xs">
            {formatRelative(new Date(shot.createdAt), new Date())}
          </Text>
          <Tooltip
            hasArrow
            label={`${shot.bookmarked ? "Remove" : "Add"} to your gallery`}
          >
            <Box>
              <Icon
                onClick={() => bookmark(!shot.bookmarked)}
                cursor="pointer"
                pointerEvents={isLoading ? "none" : "auto"}
                color={shot.bookmarked ? "red" : "inherit"}
                as={shot.bookmarked ? BsHeartFill : BsHeart}
              />
            </Box>
          </Tooltip>
        </Flex>
        <Text
          mt={2}
          cursor="text"
          noOfLines={2}
          fontSize="sm"
          fontWeight="semibold"
        >
          {shot.prompt}
        </Text>

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
    </Box>
  );
};

export default memo(ShotCard);
