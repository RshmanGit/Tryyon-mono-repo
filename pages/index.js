import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Navbar, { checkLoggedIn } from '../ui/components/Navbar';
import bg from '../ui/assets/img/layout/bg.jpg';

export default function Home() {
  return (
    <Box minH="100vh" h="100%">
      <Navbar isLoggedIn={checkLoggedIn()} />
      <Flex justifyContent="space-between">
        <Flex p="150px 100px" direction="column">
          <Text
            fontSize="24px"
            lineHeight="24px"
            casing="uppercase"
            letterSpacing="4px"
          >
            Welcome to
          </Text>
          <Text
            fontSize="100px"
            lineHeight="100px"
            fontWeight="700"
            color="blue.900"
          >
            Tryyon
          </Text>
          <Text w="500px" mt="40px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            efficitur nisi at urna condimentum tincidunt. Nullam sollicitudin
            ullamcorper malesuada. Praesent ornare faucibus pretium. Cras ex
            risus, tincidunt at fringilla vitae, faucibus quis augue. Donec
            fringilla finibus dui, a pellentesque erat interdum eu.
          </Text>
        </Flex>
        <Flex h="100vh" w="40vw" position="relative" zIndex="-1">
          <Image
            src={bg}
            alt="bg image"
            height="100vh"
            w="40vw"
            objectFit="cover"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
