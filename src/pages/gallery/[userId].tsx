import React from "react";
import PageContainer from "@/components/layout/PageContainer";
import { GetServerSidePropsContext } from "next";
import db from "@/core/db";
import SuperJSON from "superjson";
import { Box, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";

const Gallery = ({
  shots,
}: {
  shots: { blurhash: string; outputUrl: string }[];
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const userId = context.query.userId as string;
  const shots = await db.shot.findMany({
    select: { outputUrl: true, blurhash: true },
    orderBy: { createdAt: "desc" },
    where: {
      outputUrl: { not: { equals: null } },
      bookmarked: true,
      Project: {
        userId: {
          equals: userId,
        },
      },
    },
  });

  const { json: serializedShots } = SuperJSON.serialize(shots);

  return {
    props: {
      shots: serializedShots,
    },
  };
};

export default Gallery;
