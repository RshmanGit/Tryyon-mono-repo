import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

// import your icons
import { faPencil, faBan } from '@fortawesome/free-solid-svg-icons';
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
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TextBox,
  TableCaption,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  Grid,
  GridItem,
  Checkbox,
  Divider
} from '@chakra-ui/react';

// Custom components
import DefaultAuth from '../../ui/layouts/auth/Default.js';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';
import { useState } from 'react';

import { Formik, Field } from 'formik';

// maintaining initialState object
const initialState = {
  filters: {
    size: new Set(),
    colour: new Set()
  }
};

//default variants and their options
const variants = {
  size: ['small', 'medium', 'large'],
  colour: ['red', 'blue', 'green']
};
let maxy = 0;

function Entry() {
  // Chakra color mode
  const [show, SetShow] = useState(true);
  const textColorSecondary = 'gray.100';
  const [sizzz, setSize] = useState(100);

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [buttonText, setButtonText] = useState('Create');
  const [signup, setState] = useState(0);

  const handleClick = () => setShow(!show);

  let vv = Object.keys(variants);
  let kk = Object.keys(initialState.filters);

  //function to generate permutations of all possible entries dynamically
  function permute(input) {
    var out = [];
    (function permute_r(input, current) {
      if (input.length === 0) {
        out.push(current);
        return;
      }
      var next = input.slice(1);
      for (var i = 0, n = input[0].length; i != n; ++i) {
        permute_r(next, current.concat([input[0][i]]));
      }
    })(input, []);
    return out;
  }

  //for sizing purpose, setting maxy as maximum options all the variants have
  for (let i = 0; i < vv.length; i++) {
    if (variants[vv[i]].length > maxy) maxy = variants[vv[i]].length;
  }

  let res;
  let arr = [];

  kk.map((key) => {
    let s = [...initialState.filters[key]];
    if (s.length === 0) {
      s.push('');
    }
    arr.push(s);
  });

  res = permute(arr);

  return (
    <>
      <DefaultAuth illustrationBackground={'/auth.png'} image={'/auth.png'}>
        <Flex
          maxW={{ base: '100%', md: 'max-content' }}
          w="100%"
          mx={{ base: 'auto', lg: '0px' }}
          me="auto"
          h="100%"
          alignItems="start"
          justifyContent="center"
          // mb={{ base: '-20px', md: '-20px' }}
          px={{ base: '25px', md: '0px' }}
          // mt={{ base: '40px', md: '14vh' }}
          mt="120px"
          flexDirection="column"
        >
          <Box me="auto">
            <Heading color={textColor} fontSize="34px" mb="16px">
              Create your products
            </Heading>
          </Box>
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: '100%', md: '420px' }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: 'auto', lg: 'unset' }}
            me="auto"
            mb={{ base: '30px', md: 'auto' }}
          >
            <Formik
              initialValues={{
                name: '',
                description: '',
                shortDescriptions: '',
                slug: '',
                quantity: '',
                price: '',
                discountedPrice: ''
              }}
              onSubmit={(values) => {
                //   alert(JSON.stringify(values, null, 2));
                setButtonText('Creating your product...');
                let temp = parseInt(values.quantity, 10);
                let temp2 = parseInt(values.price, 10);
                let temp3 = parseInt(values.discountedPrice, 10);
                values.quantity = temp;
                values.price = temp2;
                values.discountedPrice = temp3;
                fetch('/api/products/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(values, null, 7)
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.message === 'New Product Created') {
                      setButtonText('Product created !');
                      setState(1);
                      return res;
                    } else {
                      alert(res.message);
                      setButtonText('Retry !');
                      throw new Error(
                        JSON.stringify({
                          message: res.message
                        })
                      );
                    }
                  })
                  .then((res) => alert(res.message))
                  .catch((err) => {
                    console.error(JSON.parse(err.message));
                  });
              }}
            >
              {({ handleSubmit, errors, touched }) => (
                <form>
                  <FormControl
                    mb="4px"
                    isInvalid={!!errors.name && touched.name}
                  >
                    <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Name<Text color={brandStars}>*</Text>
                    </FormLabel>
                    {/* <InputGroup size="md"> */}
                    <Field
                      as={Input}
                      isRequired={true}
                      id="name"
                      name="name"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    mb="4px"
                    isInvalid={!!errors.description && touched.description}
                  >
                    <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Description<Text color={brandStars}>*</Text>
                    </FormLabel>
                    {/* <InputGroup size="md"> */}
                    <Field
                      as={Input}
                      isRequired={true}
                      id="description"
                      name="description"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                        }
                        sessionStorage.setItem('desc', value.length);
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                    {/* </InputGroup> */}
                  </FormControl>

                  <FormControl
                    mb="4px"
                    isInvalid={
                      !!errors.shortDescriptions && touched.shortDescriptions
                    }
                  >
                    <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Short Description<Text color={brandStars}>*</Text>
                    </FormLabel>
                    {/* <InputGroup size="md"> */}
                    <Field
                      as={Input}
                      isRequired={true}
                      id="shortDescriptions"
                      name="shortDescriptions"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                          return error;
                        }
                        if (value.length >= sessionStorage.getItem('desc')) {
                          error = 'It should be less than the main description';
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>
                      {errors.shortDescriptions}
                    </FormErrorMessage>
                    {/* </InputGroup> */}
                  </FormControl>

                  <FormControl
                    mb="4px"
                    isInvalid={!!errors.slug && touched.slug}
                  >
                    <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Slug<Text color={brandStars}>*</Text>
                    </FormLabel>
                    {/* <InputGroup size="md"> */}
                    <Field
                      as={Input}
                      isRequired={true}
                      id="slug"
                      name="slug"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.slug}</FormErrorMessage>
                    {/* </InputGroup> */}
                  </FormControl>

                  <FormControl
                    mb="4px"
                    isInvalid={!!errors.quantity && touched.quantity}
                  >
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      mb="5px"
                    >
                      Quantity<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Field
                      as={Input}
                      isRequired={true}
                      id="quantity"
                      name="quantity"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        let Format = /^[0-9]*$/;
                        if (!value.match(Format)) {
                          error = 'Quantity must be present in numbers';
                        }
                        if (value[0] === '0') {
                          error = 'First digit of quantity can not be 0';
                        }
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    mb="4px"
                    isInvalid={!!errors.price && touched.price}
                  >
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      mb="5px"
                    >
                      Price<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Field
                      as={Input}
                      isRequired={true}
                      id="price"
                      name="price"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        let Format = /^[0-9]*$/;
                        if (!value.match(Format)) {
                          error = 'Price must be present in numbers';
                        }
                        if (value[0] === '0') {
                          error = 'First digit of price can not be 0';
                        }
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                        }
                        sessionStorage.setItem('price', value);
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.price}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    mb="4px"
                    isInvalid={
                      !!errors.discountedPrice && touched.discountedPrice
                    }
                  >
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      mb="5px"
                    >
                      Discounted Price<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Field
                      as={Input}
                      isRequired={true}
                      id="discountedPrice"
                      name="discountedPrice"
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      mb="3px"
                      fontWeight="500"
                      size="md"
                      validate={(value) => {
                        let error;
                        let Format = /^[0-9]*$/;
                        if (value.length === 0) {
                          error = 'Field can not be empty';
                          return error;
                        }
                        if (!value.match(Format)) {
                          error = 'Discounted Price must be present in numbers';
                        }
                        if (value[0] === '0') {
                          error =
                            'First digit of discounted price can not be 0';
                        }
                        let tt = parseInt(sessionStorage.getItem('price'), 10);
                        let rr = parseInt(value, 10);
                        if (rr >= tt) {
                          error =
                            'Discounted price should be less than the original price';
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>
                      {errors.discountedPrice}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    {/* <Flex justifyContent="space-between" align="center" mb="24px">
                    <Link href="#">
                      <a>Forgot password?</a>
                    </Link>
                  </Flex> */}
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="55%"
                      h="37"
                      mb="8px"
                      mt="13px"
                      ml="80px"
                      onClick={handleSubmit}
                    >
                      {buttonText}
                    </Button>
                    <InputRightElement
                      display="flex"
                      alignItems="center"
                      mt="20px"
                    ></InputRightElement>
                  </FormControl>
                </form>
              )}
            </Formik>
          </Flex>
        </Flex>
      </DefaultAuth>

      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="auto"
        alignItems="start"
        justifyContent="left"
        mb={{ base: '30px', md: '20px' }}
        px={{ base: '25px', md: '0px' }}
        pb={`${sizzz}px`}
        mt={{ base: '10px', md: '250px' }}
        flexDirection="column"
      >
        <Grid
          h="40px"
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(6, 1fr)"
          gap={5}
        >
          <GridItem rowSpan={1} colSpan={2}>
            <Heading ml="30px">Variants</Heading>
          </GridItem>
        </Grid>
        <Grid
          h="150px"
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(6, 1fr)"
          gap={4}
        >
          {vv.map((val) => {
            return (
              <GridItem rowSpan={1} colSpan={1} key={val}>
                <Menu closeOnSelect={false}>
                  <MenuItemOption
                    as={Button}
                    backgroundColor="black"
                    color="white"
                    ml="20px"
                    mt="20px"
                    minWidth="160px"
                    width="auto"
                    _hover={{ bg: 'gray.400' }}
                    _focus={{ color: 'white' }}
                  >
                    <Text float="left" key={val} ml="-20px">
                      {val}

                      <span>
                        {/* for updating variant name */}
                        <FontAwesomeIcon
                          icon={faPencil}
                          style={{
                            width: '15px',
                            float: 'right',
                            position: 'absolute',
                            marginLeft: '80px',
                            marginTop: '-16px'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            let result = prompt(
                              `Change the name of ${val} variant`
                            );
                            if (result.length > 0 && result !== null) {
                              variants[result] = variants[val];
                              delete variants[val];
                              delete initialState.filters[val];
                              SetShow(!show);
                            }
                          }}
                        />
                      </span>

                      <span>
                        {/* for deleting a variant */}
                        <FontAwesomeIcon
                          icon={faBan}
                          style={{
                            width: '15px',
                            float: 'right',
                            position: 'absolute',
                            marginLeft: '110px',
                            marginTop: '-16px'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            delete variants[val];
                            delete initialState.filters[val];
                            SetShow(!show);
                          }}
                        />
                      </span>
                    </Text>
                  </MenuItemOption>
                  {variants[val].map((item) => {
                    return (
                      <MenuItemOption
                        key={item}
                        onChange={(e) => {
                          e.preventDefault();
                          if (e.target.checked === true) {
                            if (
                              initialState.filters.hasOwnProperty(val) !== true
                            ) {
                              initialState.filters[val] = new Set();
                            }
                            initialState.filters[val].add(e.target.value);
                          } else {
                            initialState.filters[val].delete(e.target.value);
                          }
                          SetShow(!show);
                        }}
                        as={Checkbox}
                        value={item}
                        backgroundColor={textColorSecondary}
                        ml="10px"
                        mt="10px"
                      >
                        <Text key={item} mt="-37px" ml="10px">
                          {item}
                          <span>
                            {/* For deleting an option */}
                            <FontAwesomeIcon
                              icon={faBan}
                              style={{
                                width: '15px',
                                float: 'right',
                                position: 'absolute',
                                marginLeft: '90px',
                                marginTop: '-17px'
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                for (let i = 0; i < variants[val].length; i++) {
                                  if (variants[val][i] === item) {
                                    variants[val].splice(i, 1);
                                    let s = [...initialState.filters[val]];
                                    if (s.includes(item) === true) {
                                      initialState.filters[val].delete(item);
                                    }
                                    SetShow(!show);
                                  }
                                }
                              }}
                            />
                          </span>
                        </Text>
                      </MenuItemOption>
                    );
                  })}

                  {/* Button for adding more options for each variant */}
                  <Button
                    paddingInlineStart="10px"
                    ml="20px"
                    mt="10px"
                    width="85%"
                    fontSize="0.92em"
                    background={textColorSecondary}
                    key={val}
                    onClick={(e) => {
                      e.preventDefault();
                      let option = prompt(`Add option for ${val} variant`);
                      if (option !== null && option.length > 0) {
                        variants[val].push(option);
                        if (variants[val].length > maxy) setSize(sizzz + 50);
                        else SetShow(!show);
                      }
                    }}
                  >
                    + Add option
                  </Button>
                </Menu>
              </GridItem>
            );
          })}

          {/* Button for adding more variants limited to max 6 variants */}
          <GridItem rowSpan={1} colSpan={1}>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                colorScheme="blue"
                ml="30px"
                mt="20px"
                width="auto"
                onClick={(e) => {
                  e.preventDefault();
                  let val = prompt('Add variant');
                  if (val !== null && val.length !== 0 && vv.length < 5) {
                    variants[val] = [];
                    initialState.filters[val] = new Set();
                    SetShow(!show);
                  } else if (
                    vv.length == 5 &&
                    val !== null &&
                    val.length !== 0
                  ) {
                    variants[val] = [];
                    initialState.filters[val] = new Set();
                    setSize(sizzz + 100);
                  } else if (val !== null && val.length !== 0)
                    alert('No more variants can be added !!');
                }}
              >
                + Add variant
              </MenuButton>
            </Menu>
          </GridItem>
        </Grid>
      </Flex>

      {/* For generating table entries dynamically */}
      <TableContainer border="1px" borderColor="gray.200">
        <Table variant="simple">
          <Thead fontWeight="bold">
            <Tr>
              {vv.map((key1) => {
                return <Td key={key1}>{key1}</Td>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {res.map((table) => {
              return (
                <Tr key={table}>
                  {table.map((entry) => {
                    return <Td key={entry}>{entry}</Td>;
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Entry;
