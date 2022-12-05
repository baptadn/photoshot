import { Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { IoIosFlash } from "react-icons/io";

const Header = () => {
  const { data: session } = useSession();

  return (
    <Flex
      width="100%"
      flexDirection="column"
      marginX="auto"
      maxWidth="container.lg"
      px={6}
    >
      <Flex justifyContent="space-between" py={4} as="footer">
        <Flex
          role="group"
          as={Link}
          href="/"
          alignItems="center"
          fontWeight="bold"
          fontSize="2xl"
        >
          <Icon
            transition="200ms all"
            _groupHover={{ color: "brand.500" }}
            as={IoIosFlash}
          />
          <Text>Photoshot.</Text>
        </Flex>
        {session ? (
          <HStack>
            <Button href="/dashboard" as={Link} variant="brand" size="sm">
              Dashboard
            </Button>
            <Button
              variant="link"
              size="sm"
              color="blackAlpha.500"
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
            >
              Log out
            </Button>
          </HStack>
        ) : (
          <Button href="/login" as={Link} variant="brand" size="sm">
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
