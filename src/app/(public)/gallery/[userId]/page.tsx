import GalleryPage from "@/components/pages/GalleryPage";
import db from "@/core/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

const Gallery = async ({ params }: { params: { userId: string } }) => {
  const userId = params.userId;

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

  return <GalleryPage shots={shots} />;
};

export default Gallery;
