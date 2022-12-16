import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { HiLogout } from "react-icons/hi";
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
          <Text display={{ base: "none", sm: "inherit" }}>Photoshot.</Text>
        </Flex>
        {session ? (
          <HStack>
            <Button href="/dashboard" as={Link} variant="brand" size="sm">
              Dashboard
            </Button>
            <Tooltip hasArrow label="Public gallery">
              <Button
                href={`/gallery/${session.userId}`}
                as={Link}
                variant="outline"
                size="sm"
                _hover={{ bg: "brand.500" }}
              >
                My Gallery
              </Button>
            </Tooltip>
            <Tooltip hasArrow label="Logout">
              <IconButton
                _hover={{ bg: "brand.500" }}
                aria-label="logout"
                icon={<HiLogout />}
                size="sm"
                variant="ghost"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              />
            </Tooltip>
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
