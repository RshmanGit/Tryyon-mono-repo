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

const Navbar = () => {
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
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
        mr="20px"
      >
        <Button
          ml="5px"
          mt="5px"
          backgroundColor="black"
          borderRadius="17px"
          color="white"
          padding="6px"
          paddingLeft="10px"
          paddingRight="10px"
          fontWeight="500"
          float="right"
        >
          <Link href="/auth/admin/login">Sign in as Admin</Link>
        </Button>
      </Stack>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        display={{ base: 'block', md: 'flex' }}
        width={{ base: 'full', md: 'auto' }}
        alignItems="right"
        mt={{ base: 4, md: 0 }}
      >
        <Button
          m="5px"
          mr="7px"
          backgroundColor="black"
          borderRadius="17px"
          color="white"
          padding="6px"
          paddingLeft="10px"
          paddingRight="10px"
          fontWeight="500"
          float="right"
        >
          <Link href="/auth/login">Sign in as User</Link>
        </Button>
      </Stack>
    </Flex>
  );
};

export default Navbar;
