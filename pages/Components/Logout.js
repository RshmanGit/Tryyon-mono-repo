import React from 'react';
import Link from 'next/link';
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react';

const Logout = () => {
  return (
    <Flex
      as="nav"
      alignContent="right"
      alignItems="right"
      align="right"
      justify="space-between"
      wrap="wrap"
      padding={6}
      //   bg="teal.500"
      color="black"
      fontWeight="bold"
      fontFamily="sans-serif"
      fontSize="15px"
      backgroundColor="#F0F0F0"
    >
      <Text fontSize="2.2em" ml="12px" fontWeight="bold">
        Tryyon
      </Text>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        display={{ base: 'block', md: 'flex' }}
        width={{ base: 'full', md: 'auto' }}
        alignItems="right"
        mt={{ base: 4, md: 0 }}
      >
        <Button
          m="5px"
          mr="14px"
          backgroundColor="black"
          borderRadius="17px"
          color="white"
          padding="6px"
          paddingLeft="12px"
          paddingRight="12px"
          fontWeight="700"
          float="right"
          onClick={() => {
            sessionStorage.clear();
          }}
        >
          <Link href="/">Log out</Link>
        </Button>
      </Stack>
    </Flex>
  );
};

export default Logout;
