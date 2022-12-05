import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useMutation } from "react-query";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { mutate: login, isLoading } = useMutation(
    "login",
    () =>
      signIn("email", { email, redirect: false, callbackUrl: "/dashboard" }),
    {
      onSuccess: () => {
        router.push("/login?verifyRequest=1");
      },
    }
  );

  return (
    <Stack spacing={4} width="100%" mx="auto" maxW="md" py={12} px={6}>
      <Stack textAlign="center" align="center" spacing={0}>
        <Text fontWeight="extrabold" as="h2" fontSize="4xl">
          Sign in to Photoshot.
        </Text>
        <Text fontSize="lg">Use your email address to sign in</Text>
      </Stack>
      <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
        <Stack
          as="form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (email) {
              login();
            }
          }}
          spacing={4}
        >
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="sarah@gmail.com"
              type="email"
            />
          </FormControl>
          <Stack spacing={10}>
            <Button
              isLoading={isLoading}
              rightIcon={<FaPaperPlane />}
              type="submit"
              variant="brand"
            >
              Send magic link
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
