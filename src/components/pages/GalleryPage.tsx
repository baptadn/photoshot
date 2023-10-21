"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Box, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";

const GalleryPage = ({
  shots,
}: {
  shots: { blurhash: string | null; outputUrl: string | null }[];
}) => {
  return (
    <PageContainer>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {shots.map((shot) => (
          <Box
            key={shot.outputUrl}
            overflow="hidden"
            backgroundColor="white"
            borderRadius="lg"
            width="100%"
            position="relative"
          >
            <Image
              placeholder="blur"
              blurDataURL={shot.blurhash || "placeholder"}
              quality={100}
              alt={shot.outputUrl!}
              src={shot.outputUrl!}
              width={512}
              height={512}
              unoptimized
            />
          </Box>
        ))}
      </SimpleGrid>
      {shots.length === 0 && (
        <Box
          borderRadius="xl"
          p={10}
          backgroundColor="white"
          textAlign="center"
        >
          No shots in this gallery
        </Box>
      )}
    </PageContainer>
  );
};

export default GalleryPage;
