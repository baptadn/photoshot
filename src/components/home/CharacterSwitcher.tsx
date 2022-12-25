import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import AvatarsPlaceholder from "./AvatarsPlaceholder";

export type TCharacter = "romy" | "sacha";

const CharacterSwitcher = ({
  onCharacterChange,
}: {
  onCharacterChange: (character: TCharacter) => void;
}) => {
  const [character, setCharacter] = useState<TCharacter>("romy");

  return (
    <Box>
      <Box display={{ base: "none", md: "block" }} position="relative">
        <AvatarsPlaceholder character={character} />
      </Box>
      <ButtonGroup
        pl={4}
        mt={4}
        mx="auto"
        size="sm"
        isAttached
        variant="outline"
      >
        <Button
          variant={character === "romy" ? "brand" : "outline"}
          onClick={() => {
            setCharacter("romy");
            onCharacterChange("romy");
          }}
        >
          Romy
        </Button>
        <Button
          variant={character === "sacha" ? "brand" : "outline"}
          onClick={() => {
            setCharacter("sacha");
            onCharacterChange("sacha");
          }}
        >
          Sacha
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CharacterSwitcher;
