import { formatStudioPrice } from "@/core/utils/prices";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  List,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CheckedListItem } from "../home/Pricing";

const FormPayment = ({
  project,
  handlePaymentSuccess,
}: {
  project: Project;
  handlePaymentSuccess: () => void;
}) => {
  const [waitingPayment, setWaitingPayment] = useState(false);
  const { query } = useRouter();

  useQuery(
    "check-payment",
    () =>
      axios.get(`/api/checkout/check/${query.ppi}/${query.session_id}/studio`),
    {
      cacheTime: 0,
      refetchInterval: 10,
      enabled: waitingPayment,
      onSuccess: () => {
        handlePaymentSuccess();
      },
    }
  );

  useEffect(() => {
    setWaitingPayment(query.ppi === project.id);
  }, [query, project]);

  return (
    <Box textAlign="center" width="100%">
      {waitingPayment ? (
        <Box>
          <Spinner speed="1s" size="xl" />
          <Text mt={2} size="sm">
            Validating payment
          </Text>
        </Box>
      ) : (
        <VStack spacing={4}>
          <Box fontWeight="black" fontSize="3.5rem">
            {formatStudioPrice()}
            <Box
              ml={1}
              as="span"
              fontWeight="500"
              color="coolGray.400"
              fontSize="1.2rem"
            >
              / studio
            </Box>
          </Box>
          <Box fontWeight="bold" fontSize="xl">
            Your Studio is ready to be trained!
          </Box>
          <List textAlign="left" spacing={1}>
            <CheckedListItem>
              <b>1</b> Studio with a <b>custom trained model</b>
            </CheckedListItem>
            <CheckedListItem>
              <b>{process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT}</b> avatars 4K
              generation
            </CheckedListItem>
            <CheckedListItem>
              <b>30</b> AI prompt assists
            </CheckedListItem>
            <CheckedListItem>
              Your Studio will be deleted 24 hours after your credits are
              exhausted
            </CheckedListItem>
          </List>
          <Button
            as={Link}
            variant="brand"
            href={`/api/checkout/session?ppi=${project.id}`}
          >
            Unlock Now - {formatStudioPrice()}
          </Button>
          <Box pt={4}>
            <AvatarGroup size="md" max={10}>
              {project.imageUrls.map((url) => (
                <Avatar key={url} src={url} />
              ))}
            </AvatarGroup>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default FormPayment;
