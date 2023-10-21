import { Box, useDisclosure } from "@chakra-ui/react";
import { Shot } from "@prisma/client";
import Image from "next/image";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";

const ShotImage = ({ shot, isHd = false }: { shot: Shot; isHd?: boolean }) => {
  const { onOpen, onClose, isOpen: isZoomed } = useDisclosure();

  return (
    <Box width="100%" backgroundColor="gray.100" overflow="hidden">
      <ControlledZoom
        isZoomed={isZoomed}
        onZoomChange={(shouldZoom) => {
          shouldZoom ? onOpen() : onClose();
        }}
      >
        <Image
          placeholder="blur"
          blurDataURL={shot.blurhash || "placeholder"}
          alt={shot.prompt}
          src={isHd ? shot.hdOutputUrl! : shot.outputUrl!}
          width={512}
          height={512}
          unoptimized
        />
      </ControlledZoom>
    </Box>
  );
};

export default ShotImage;
