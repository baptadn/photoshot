import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { Shot } from "@prisma/client";
import axios from "axios";
import { formatRelative } from "date-fns";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineModelTraining } from "react-icons/md";
import { Ri4KFill } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import ShotImage from "./ShotImage";
import { TbFaceIdError } from "react-icons/tb";

const getHdLabel = (shot: Shot, isHd: boolean) => {
  if (shot.hdStatus === "NO") {
    return "Generate in 4K";
  }

  if (shot.hdStatus === "PENDING") {
    return "4K in progress";
  }

  if (shot.hdStatus === "PROCESSED" && isHd) {
    return "Show standard resolution";
  }

  return "Show 4K";
};

const ShotCard = ({
  shot: initialShot,
  handleSeed,
}: {
  shot: Shot;
  handleSeed: (shot: Shot) => void;
}) => {
  const { onCopy, hasCopied } = useClipboard(initialShot.prompt);
  const { query } = useRouter();
  const [shot, setShot] = useState(initialShot);
  const [isHd, setIsHd] = useState(Boolean(shot.hdOutputUrl));

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

  const { mutate: createdHd, isLoading: isCreatingHd } = useMutation(
    `create-hd-${initialShot.id}`,
    () =>
      axios.post<{ shot: Shot }>(
        `/api/projects/${query.id}/predictions/${initialShot.id}/hd`
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
      enabled: !initialShot.outputUrl && initialShot.status !== "failed",
      initialData: { shot: initialShot },
      onSuccess: (response) => {
        setShot(response.shot);
      },
    }
  );

  useQuery(
    `shot-hd-${initialShot.id}`,
    () =>
      axios
        .get<{ shot: Shot }>(
          `/api/projects/${query.id}/predictions/${initialShot.id}/hd`
        )
        .then((res) => res.data),
    {
      refetchInterval: (data) =>
        data?.shot.hdStatus !== "PENDING" ? false : 5000,
      refetchOnWindowFocus: false,
      enabled: shot.hdStatus === "PENDING",
      initialData: { shot: initialShot },
      onSuccess: (response) => {
        setShot(response.shot);
        if (response.shot.hdOutputUrl) {
          setIsHd(true);
        }
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
        <ShotImage isHd={isHd} shot={shot} />
      ) : (
        <Box>
          <AspectRatio ratio={1}>
            {shot.status === "failed" ? (
              <Center backgroundColor="beige.50" width="100%">
                <VStack>
                  <Icon fontSize="3xl" as={TbFaceIdError} />
                  <Box fontSize="sm" color="blackAlpha.700">
                    Shot generation failed
                  </Box>
                </VStack>
              </Center>
            ) : (
              <Center backgroundColor="gray.100" width="100%">
                <Spinner size="xl" speed="2s" color="gray.400" />
              </Center>
            )}
          </AspectRatio>
        </Box>
      )}
      <Flex position="relative" p={3} flexDirection="column">
        <Flex alignItems="center" justifyContent="flex-end">
          <Box>
            {shot.seed && shot.outputUrl && (
              <Tooltip hasArrow label="Re-use style">
                <IconButton
                  size="sm"
                  onClick={() => {
                    handleSeed(shot);
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                  variant="ghost"
                  aria-label="Download"
                  fontSize="md"
                  icon={<MdOutlineModelTraining />}
                />
              </Tooltip>
            )}
            {shot.outputUrl && (
              <>
                <IconButton
                  size="sm"
                  as={Link}
                  href={isHd ? shot.hdOutputUrl : shot.outputUrl}
                  target="_blank"
                  variant="ghost"
                  aria-label="Download"
                  fontSize="md"
                  icon={<HiDownload />}
                />
                <Tooltip hasArrow label={getHdLabel(shot, isHd)}>
                  <IconButton
                    icon={<Ri4KFill />}
                    color={isHd ? "red.400" : "gray.600"}
                    isLoading={shot.hdStatus === "PENDING" || isCreatingHd}
                    onClick={() => {
                      if (shot.hdStatus === "NO") {
                        createdHd();
                      } else if (
                        shot.hdStatus === "PROCESSED" &&
                        shot.hdOutputUrl
                      ) {
                        setIsHd(!isHd);
                      }
                    }}
                    size="sm"
                    variant="ghost"
                    aria-label="Make 4K"
                    fontSize="lg"
                  />
                </Tooltip>
              </>
            )}

            <Tooltip
              hasArrow
              label={`${shot.bookmarked ? "Remove" : "Add"} to your gallery`}
            >
              <IconButton
                isLoading={isLoading}
                size="sm"
                variant="ghost"
                aria-label="Bookmark"
                fontSize="md"
                icon={shot.bookmarked ? <BsHeartFill /> : <BsHeart />}
                onClick={() => bookmark(!shot.bookmarked)}
                pointerEvents={isLoading ? "none" : "auto"}
                color={shot.bookmarked ? "red" : "inherit"}
              />
            </Tooltip>
          </Box>
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

        <HStack justifyContent="space-between" mt={4}>
          <Text color="beige.400" fontSize="xs">
            {formatRelative(new Date(shot.createdAt), new Date())}
          </Text>
          <Button
            rightIcon={hasCopied ? <IoMdCheckmarkCircleOutline /> : undefined}
            colorScheme="beige"
            size="xs"
            variant="link"
            onClick={onCopy}
          >
            {hasCopied ? "Copied" : "Copy prompt"}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default memo(ShotCard);
