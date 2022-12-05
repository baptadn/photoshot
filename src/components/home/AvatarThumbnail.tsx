import { Box, BoxProps } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const AvatarThumbnail = ({ src, ...props }: { src: string } & BoxProps) => (
  <Box width="80px" shadow="lg" overflow="hidden" borderRadius="md" {...props}>
    <Image alt="avatar" src={src} width={80} height={80} />
  </Box>
);

export default AvatarThumbnail;
