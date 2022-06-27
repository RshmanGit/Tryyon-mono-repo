import React from 'react';
import Link from 'next/link';

import { Formik, Field } from 'formik';

// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

// Custom components
import DefaultAuth from '../../ui/layouts/auth/Default.js';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';

function Dash() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  let router = useRouter();

  useEffect(() => {
    if (!sessionStorage.token_use) {
      alert('Login first !');
      router.push('/auth/login');
    } else if (!sessionStorage.company) {
      alert('Register your company first');
      router.push('/auth/create/company');
    } else if (!sessionStorage.tenant) {
      alert('Register your tenant first');
      router.push('/auth/create/tenant');
    }
  });

  return (
    <DefaultAuth illustrationBackground={'/auth.png'} image={'/auth.png'}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      ></Flex>
    </DefaultAuth>
  );
}

export default Dash;
