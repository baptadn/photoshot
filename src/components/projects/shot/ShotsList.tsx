import ShotCard from "@/components/projects/shot/ShotCard";
import useProjectContext from "@/hooks/use-project-context";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { Shot } from "@prisma/client";

const ShotsList = () => {
  const {
    shots,
    hasMoreResult,
    isLoadingMore,
    updateShotTemplate,
    fetchShots,
  } = useProjectContext();

  return (
    <>
      {shots.length === 0 ? (
        <Box textAlign="center" fontSize="lg">
          {`You don't have any prompt yet. It's time to be creative!`}
        </Box>
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            spacing={10}
            alignItems="flex-start"
          >
            {shots.map((shot: Shot) => (
              <ShotCard
                key={shot.id}
                shot={shot}
                handleSeed={(updatedShot) => {
                  updateShotTemplate(updatedShot);
                }}
              />
            ))}
          </SimpleGrid>

          {hasMoreResult && (
            <Box mt={4} textAlign="center" width="100%">
              <Button
                isLoading={isLoadingMore}
                variant="brand"
                onClick={() => {
                  fetchShots();
                }}
              >
                Load more
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ShotsList;
