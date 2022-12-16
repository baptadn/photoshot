import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { BsChevronDown } from "react-icons/bs";
import { IoIosFlash } from "react-icons/io";

const BuyShotButton = ({
  credits,
  onPaymentSuccess,
}: {
  credits: number;
  onPaymentSuccess: (credits: number) => void;
}) => {
  const { push, query } = useRouter();
  const [waitingPayment, setWaitingPayment] = useState(false);

  const { isLoading } = useQuery(
    "check-shot-payment",
    () =>
      axios.get(`/api/checkout/check/${query.ppi}/${query.session_id}/shot`),
    {
      cacheTime: 0,
      refetchInterval: 4,
      retry: 0,
      enabled: waitingPayment,
      onSuccess: (response) => {
        onPaymentSuccess(response.data.credits);
      },
      onSettled: () => {
        setWaitingPayment(false);
      },
    }
  );

  useEffect(() => {
    setWaitingPayment(query.ppi === query.id);
  }, [query]);

  const handleShotPayment = (quantity: number) => {
    push(`/api/checkout/shots?quantity=${quantity}&ppi=${query.id}`);
  };

  return (
    <Menu>
      <MenuButton
        rightIcon={<BsChevronDown />}
        isLoading={isLoading}
        size="xs"
        shadow="none"
        variant="brand"
        as={Button}
      >
        <HStack spacing={0}>
          <IoIosFlash />
          {credits === 0 ? (
            <Text>Buy more shots</Text>
          ) : (
            <Text>
              {credits} Shot{credits > 1 && "s"} left
            </Text>
          )}
        </HStack>
      </MenuButton>
      <MenuList fontSize="sm">
        <MenuItem
          command="$4"
          onClick={() => {
            handleShotPayment(100);
          }}
        >
          Add <b>100 shots</b>
        </MenuItem>
        <MenuItem
          command="$7"
          onClick={() => {
            handleShotPayment(200);
          }}
        >
          Add <b>200 shots</b>
        </MenuItem>
        <MenuItem
          command="$9"
          onClick={() => {
            handleShotPayment(300);
          }}
        >
          Add <b>300 shots</b>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default BuyShotButton;
