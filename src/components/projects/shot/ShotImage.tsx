import { Box, useDisclosure } from "@chakra-ui/react";
import { Shot } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";

const ShotImage = ({ shot }: { shot: Shot }) => {
  const { push, query } = useRouter();
  const { onOpen, onClose, isOpen: isZoomed } = useDisclosure();

  return (
    <Box
      height="100px"
      width="100px"
      backgroundColor="gray.100"
      borderRadius="xl"
      overflow="hidden"
    >
      <ControlledZoom
        isZoomed={isZoomed}
        onZoomChange={(shouldZoom) => {
          push(
            {
              query: {
                id: query.id,
                ...(shouldZoom && { zoomId: shot.id }),
              },
            },
            undefined,
            {
              shallow: true,
            }
          );

          shouldZoom ? onOpen() : onClose();
        }}
      >
        <Image
          unoptimized
          alt={shot.prompt}
          src={shot.outputUrl!}
          width={512}
          height={512}
        />
      </ControlledZoom>
    </Box>
  );
};

export default ShotImage;
