import AuthForm from "@/components/layout/AuthForm";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { MdCheckCircleOutline } from "react-icons/md";

const Login = () => {
  const router = useRouter();

  return (
    <Flex flex="1" align="center" justify="center">
      {router.query.verifyRequest ? (
        <Box mx={{ base: 4, md: 0 }} textAlign="center">
          <Heading>
            Check your email <Icon mb="-4px" as={MdCheckCircleOutline} />
          </Heading>
          <Text mt={3} fontSize="2xl">
            A <b>sign in link</b> has been sent to your email address.
          </Text>
        </Box>
      ) : (
        <AuthForm />
      )}
    </Flex>
  );
};

export default Login;
