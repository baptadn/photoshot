import { Box, chakra, Container, Stack, Text } from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { ReactNode } from "react";
import { MdAlternateEmail } from "react-icons/md";

const SocialButton = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  return (
    <chakra.button
      href={href}
      as="a"
      bg="blackAlpha.100"
      rounded="full"
      w={8}
      h={8}
      target="_blank"
      cursor="pointer"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      _hover={{
        bg: "blackAlpha.400",
      }}
    >
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box>
      <Container
        as={Stack}
        maxWidth="container.lg"
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text></Text>
        <Stack alignItems="center" direction="row" spacing={6}>
          <Text fontSize="lg" fontWeight="bold">
            Photoshot.
          </Text>
          <SocialButton href="https://github.com/shinework/photoshot">
            <FaGithub />
          </SocialButton>
          <SocialButton href="https://twitter.com/photoshot_ai">
            <FaTwitter />
          </SocialButton>
          <SocialButton href="mailto:support@photoshot.app">
            <MdAlternateEmail />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
