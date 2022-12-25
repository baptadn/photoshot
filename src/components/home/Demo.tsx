import { prompts } from "@/core/utils/prompts";
import { Box, Flex, Image } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Pause, WindupChildren } from "windups";
import AvatarsPlaceholder from "./AvatarsPlaceholder";
import urlSlug from "url-slug";

const MotionImage = motion(Image);
const MotionBox = motion(Box);

const Demo = () => {
  const [step, setStep] = useState(0);
  const prompt = prompts[step];
  const names = ["romy", "sacha"] as const;
  const index = Math.random() >= 0.5 ? 1 : 0;

  return (
    <Box ml={{ base: 0, lg: 10 }} width="100%">
      <Box
        width="100%"
        marginX="auto"
        fontSize="md"
        shadow="0 14px 40px 10px #B5FFD9, 0 5px 10px -7px black"
        borderRadius="md"
        py={2}
        px={3}
        backgroundColor="white"
        borderWidth={1}
        borderColor="gray.200"
      >
        <WindupChildren
          onFinished={() => {
            setStep(step === prompts.length - 1 ? 0 : step + 1);
          }}
        >
          {prompt.prompt.split(",")[0]}
          <Pause ms={4000} />
        </WindupChildren>
        <MotionBox
          borderRight="1px"
          borderColor="gray.400"
          as="span"
          bg="white"
          ml={1}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
      </Box>
      <Flex justifyContent="space-between" mt={6} pr={6}>
        <Box width="100%" position="relative" ml={10}>
          <AvatarsPlaceholder character={names[index]} />
        </Box>
        <AnimatePresence mode="wait">
          <MotionImage
            key={prompt.label}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ delay: 0.2 }}
            shadow="2xl"
            borderRadius="3xl"
            width="14rem"
            zIndex={10}
            alt={prompt.label}
            src={`/prompts/${names[index]}/${urlSlug(prompt.label, {
              separator: "-",
            })}.png`}
          />
        </AnimatePresence>
      </Flex>
    </Box>
  );
};

export default Demo;
