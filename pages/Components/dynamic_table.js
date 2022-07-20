import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker } from 'chakra-ui-date-input';
import { useFormik } from 'formik';

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  InputRightElement,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  Grid,
  GridItem,
  Checkbox,
  useDisclosure,
  Progress,
  useToast,
  Switch,
  Select
} from '@chakra-ui/react';

import { useRouter } from 'next/router.js';
import { useEffect } from 'react';
import { useState, useRef } from 'react';

import { Formik, Field } from 'formik';

// maintaining initialState object
const initialState = {
  filters: {
    Size: new Set(),
    Colour: new Set()
  }
};
let ll = 0;
const locat = {};

//default variants and their options
const variants = {
  Size: ['small', 'medium', 'large'],
  Colour: ['red', 'blue', 'green']
};

let maxy = 0,
  mp = [];

let flag = true,
  flag2 = true,
  flag3 = true;
function Entry() {
  // Chakra color mode
  const [show, SetShow] = useState(true);
  const textColorSecondary = 'gray.100';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sizzz, setSize] = useState(100);
  const [supplier, setSupp] = useState('');
  const [Trend, setTrend] = useState(false);
  const [Check, setCheck] = useState(false);
  const [Prod, setProd] = useState(false);
  const [Mark, setMark] = useState(false);
  const [play, setPlay] = useState([]);
  const [okay, setOkay] = useState('Select Supplier');
  const [categories, setCategories] = useState({});
  //For Progress bar
  const [time, setTimer] = useState(true);
  const [stripe, setStr] = useState(true);
  const [colors, setColor] = useState('twitter');
  const [anim, setAnim] = useState(true);
  const [array, setArray] = useState([]);
  const [cat, setCat] = useState([]);

  const [categ, setCateg] = useState([]);
  const [rrrr, setRRRR] = useState([]);
  const [dat, setDat] = useState('');
  const [dat2, setDat2] = useState('');
  const [loc, setLoc] = useState([]);
  const [messagee, setMess] = useState({ first: [''], second: 0 });

  const textColor = useColorModeValue('navy.700', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [buttonText, setButtonText] = useState('Create');

  const router = useRouter();
  const toast = useToast();

  const [reseller, setReseller] = useState({
    allowed: false,
    type: '',
    value: 0
  });

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  useEffect(() => {
    fetch('/api/tenant/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Tenants found') {
          return res;
        } else {
          throw new Error(
            JSON.stringify({
              message: res.message
            })
          );
        }
      })
      .then((res) => {
        if (res.message === 'Tenants found') {
          setArray(res.tenants);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });

    fetch('/api/products/category/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Categories found') {
          return res;
        } else {
          throw new Error(
            JSON.stringify({
              message: res.message
            })
          );
        }
      })
      .then((res) => {
        if (res.message === 'Categories found') {
          console.log(res.categories);
          setCategories((prev) => ({
            ...prev,
            'Root Category': res.categories
          }));
          setCat(res.categories);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });

    fetch('/api/location/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Locations found') {
          return res;
        } else {
          throw new Error(
            JSON.stringify({
              message: res.message
            })
          );
        }
      })
      .then((res) => {
        if (res.message === 'Locations found') {
          locat['Locations'] = res.locations;
          setLoc(res.locations);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  useEffect(() => {
    //After closing modal, get back to the page
    if (!sessionStorage.token_admin) {
      alert('Login first !');
      router.push('/auth/admin/login');
    }
    if (time === false) {
      router.push('/admin/Product');
      setTimer(true);
    }
  }, [time, router, cat.length]);

  let vv = Object.keys(variants);
  let cc = Object.keys(categories);
  let dd = Object.keys(locat);
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

  let res1;
  let arr = [];

  kk.map((key) => {
    let s = [...initialState.filters[key]];
    if (s.length === 0) {
      s.push('');
    }
    arr.push(s);
  });

  res1 = permute(arr);
  for (let i = 0; i < res1.length; i++) {
    if (flag === false) {
      res1[i].push(
        String(
          parseInt(parseInt(sessionStorage.getItem('quantity')) / res1.length)
        )
      );
    }
    if (flag2 === false) {
      res1[i].push(String(sessionStorage.getItem('price')));
    }
    if (flag3 === false) {
      res1[i].push(String(sessionStorage.getItem('disprice')));
    }
  }
  for (let i = 0; i < mp.length; i++) {
    res1[mp[i][0]][mp[i][1]] = mp[i][2];
  }

  function solve_cat(id_c, id_name) {
    console.log(id_name);
    fetch(`/api/products/category?id=${id_c}&includeChildren=true`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Categories found') {
          return res;
        } else {
          // alert(res.message);
          throw new Error(
            JSON.stringify({
              message: res.message
            })
          );
        }
      })
      .then((res) => {
        if (res.message === 'Categories found') {
          if (res.categories[0].children.length > 0) {
            categories[id_name] = res.categories[0].children;
            setCat(res.categories[0].children);
          }
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function check2() {
    console.log(play);
    fetch('/api/sku/bulk-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.token_admin}`
      },
      body: JSON.stringify({ body: play })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'New SKUs Created') {
          setButtonText('Product & SKUs created !');
          return res;
        } else {
          setButtonText('Retry !');
          throw new Error(
            JSON.stringify({
              message: res.message
            })
          );
        }
      })
      .then((res) => {
        if (res.message === 'New SKUs Created') {
          setMess({
            first: `Close the tab to go back !  Total SKU entries created: ${play.length}`,
            second: messagee.second + ll
          });
          setStr(false);
          setColor('whatsapp');
          setAnim(false);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function check(values, arr2, table, ent, idx, len) {
    let arr3 = {};
    arr3.productId = sessionStorage.getItem('productID');
    arr3.price = values.price;
    arr3.discountedPrice = values.discountedPrice;
    arr3.slug = values.slug;
    arr3.quantity = arr2.quantity;
    arr3.attributes = {};
    arr3.supplierId = arr2.supplierId;
    arr3.categoryIds = arr2.categoryIds;

    let ix = 0;
    vv.map((kkk) => {
      arr3.attributes[kkk] = table[ix++];
    });
    play.push(arr3);
    setPlay(play);
  }
  return (
    <>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        ml="30px"
        h="100%"
        alignItems="start"
        justifyContent="center"
        px={{ base: '25px', md: '0px' }}
        mt="5px"
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
              discountedPrice: '',
              attributes: {},
              manufacturer: '',
              countryOfOrigin: '',
              trending: false,
              guestCheckout: false,
              private_product: false,
              marketPlace: false
            }}
            onSubmit={(values) => {
              console.log(loc);
              let temp = parseInt(values.quantity, 10);
              let temp2 = parseInt(values.price, 10);
              let temp3 = parseInt(values.discountedPrice, 10);

              let arr2 = {};
              arr2.name = values.name;
              arr2.description = values.description;
              arr2.locationIds = [];
              console.log(rrrr);
              rrrr.map((item) => {
                arr2.locationIds.push(item);
              });
              arr2.shortDescriptions = values.shortDescriptions;
              arr2.slug = values.slug;
              arr2.reseller = { allowed: reseller.allowed };
              if (reseller.allowed) {
                if (
                  reseller.type !== 'commission' &&
                  reseller.type !== 'discount'
                ) {
                  toast({
                    title: 'Reseller Type not selected',
                    status: 'error',
                    isClosable: true
                  });

                  throw new Error(
                    JSON.stringify({
                      message: 'Reseller type not selected'
                    })
                  );
                }
                arr2.reseller.type = reseller.type;
                arr2.reseller[reseller.type] = reseller.value;
              }
              arr2.quantity = temp;
              arr2.supplierId = supplier;
              console.log(supplier);
              if (supplier.length === 0) {
                toast({
                  title: `Select supplier ID`,
                  status: 'error',
                  isClosable: true
                });
                throw new Error(
                  JSON.stringify({
                    message: 'Supplier ID not selected'
                  })
                );
              }
              arr2.categoryIds = categ;
              arr2.manufacturer = values.manufacturer;
              arr2.countryOfOrigin = values.countryOfOrigin;
              arr2.trending = Trend;

              if (!dat) {
                toast({
                  title: `Featured From Date not selected`,
                  status: 'error',
                  isClosable: true
                });

                throw new Error(
                  JSON.stringify({
                    message: 'Featured From Date not selected'
                  })
                );
              } else arr2.featuredFrom = dat;

              if (!dat) {
                toast({
                  title: `Featured To Date not selected`,
                  status: 'error',
                  isClosable: true
                });

                throw new Error(
                  JSON.stringify({
                    message: 'Featured To Date not selected'
                  })
                );
              } else arr2.featuredTo = dat2;
              arr2.guestCheckout = Check;
              arr2.private_product = Prod;
              arr2.marketPlace = Mark;
              if (arr2.categoryIds.length === 0) {
                toast({
                  title: `Select categories`,
                  status: 'error',
                  isClosable: true
                });
                throw new Error(
                  JSON.stringify({
                    message: 'Categories not selected'
                  })
                );
              }
              if (arr2.locationIds.length === 0) {
                toast({
                  title: `Select locations`,
                  status: 'error',
                  isClosable: true
                });
                throw new Error(
                  JSON.stringify({
                    message: 'Locations not selected'
                  })
                );
              }

              variants.Quantity = [temp];
              variants.Price = [temp2];
              variants.DiscountedPrice = [temp3];
              arr2.attributes = variants;

              values.price = temp2;
              values.discountedPrice = temp3;
              setButtonText('Creating your product...');
              fetch('/api/products/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${sessionStorage.token_admin}`
                },
                body: JSON.stringify(arr2, null)
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.message === 'New Product Created') {
                    setButtonText('Product created !');
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
                .then((res) => {
                  if (res.message === 'New Product Created') {
                    sessionStorage.setItem('productID', res.product.id);
                    onOpen();
                    ll = 100 / (res1.length + 1);
                    setMess({
                      first: res.message,
                      second: messagee.second + ll
                    });
                  }
                })
                .then(() => {
                  res1.map((table, idx) => {
                    check(values, arr2, table, vv, idx + 1, res1.length);
                  });
                })
                .then(() => {
                  check2();
                })
                .then(() => {
                  values.quantity = '';
                  values.price = '';
                  values.discountedPrice = '';
                  setPlay([]);
                })
                .catch((err) => {
                  console.log(err.message);
                });

              delete variants.Quantity;
              delete variants.Price;
              delete variants.DiscountedPrice;
              SetShow(!show);
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form>
                <Flex>
                  <Flex
                    bgColor="white"
                    borderRadius="2xl"
                    p="32px"
                    h="max-content"
                    direction="column"
                  >
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
                            error =
                              'It should be less than the main description';
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
                          if (value && !value.match(Format)) {
                            error = 'Quantity must be present in numbers';
                          }
                          if (value[0] === '0') {
                            error = 'First digit of quantity can not be 0';
                          }
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                          } else {
                            sessionStorage.setItem('quantity', value);
                            flag = false;
                            SetShow(!show);
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
                          } else {
                            sessionStorage.setItem('price', value);
                            flag2 = false;
                            SetShow(!show);
                          }
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
                            error =
                              'Discounted Price must be present in numbers';
                          }
                          if (value[0] === '0') {
                            error =
                              'First digit of discounted price can not be 0';
                          }
                          let tt = parseInt(
                            sessionStorage.getItem('price'),
                            10
                          );
                          let rr = parseInt(value, 10);
                          if (rr >= tt) {
                            error =
                              'Discounted price should be less than the original price';
                          } else {
                            sessionStorage.setItem('disprice', value);
                            flag3 = false;
                            SetShow(!show);
                          }

                          return error;
                        }}
                      />
                      <FormErrorMessage>
                        {errors.discountedPrice}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.manufacturer && touched.manufacturer}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Manufacturer<Text color={brandStars}>*</Text>
                      </FormLabel>
                      {/* <InputGroup size="md"> */}
                      <Field
                        as={Input}
                        isRequired={true}
                        id="manufacturer"
                        name="manufacturer"
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
                      <FormErrorMessage>{errors.manufacturer}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={
                        !!errors.countryOfOrigin && touched.countryOfOrigin
                      }
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Country of Origin<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="countryOfOrigin"
                        name="countryOfOrigin"
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
                      <FormErrorMessage>
                        {errors.countryOfOrigin}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.reseller && touched.reseller}
                    >
                      <Flex ms="4px" mt="12px" justifyContent="space-between">
                        <FormLabel
                          fontSize="sm"
                          fontWeight="500"
                          color={textColor}
                          display="flex"
                        >
                          Reseller
                        </FormLabel>
                        <Switch
                          id="reseller_allowed"
                          name="reseller_allowed"
                          checked={reseller.allowed}
                          onChange={(e) =>
                            setReseller((reseller) => {
                              const { allowed, ...rest } = reseller;
                              return { allowed: !allowed, ...rest };
                            })
                          }
                        />
                      </Flex>
                      {reseller.allowed && (
                        <Flex gap="12px" my="8px">
                          <Field
                            as={Select}
                            id="reseller_type"
                            name="reseller_type"
                            minW="300px"
                            placeholder="Select reseller type"
                            onChange={(e) =>
                              setReseller((prev) => {
                                prev.type = e.target.selectedOptions[0].value;
                                return prev;
                              })
                            }
                          >
                            <option value="commission">Commission</option>
                            <option value="discount">Discount</option>
                          </Field>
                          <Field
                            as={Input}
                            type="number"
                            id="reseller_type_value"
                            name="reseller_type_value"
                            placeholder="0"
                            onChange={(e) =>
                              setReseller((prev) => {
                                prev.value = e.target.value;
                                return prev;
                              })
                            }
                          />
                        </Flex>
                      )}
                      <FormErrorMessage>{errors.reseller}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.featuredFrom && touched.featuredFrom}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Featured From<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="date"
                        isRequired={true}
                        id="featuredFrom"
                        name="featuredFrom"
                        variant="auth"
                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        onChange={(e) => {
                          setDat(new Date(e.target.value).toISOString());
                        }}
                      />
                      <FormErrorMessage>{errors.featuredFrom}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.featuredTo && touched.featuredTo}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Featured To<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="date"
                        isRequired={true}
                        id="featuredTo"
                        name="featuredTo"
                        placeholder={dat2}
                        variant="auth"
                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        onChange={(e) => {
                          setDat2(new Date(e.target.value).toISOString());
                        }}
                      />
                      <FormErrorMessage>{errors.featuredTo}</FormErrorMessage>
                    </FormControl>
                    <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Supplier<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Menu strategy="fixed">
                      <MenuButton
                        as={Button}
                        bgColor="transparent"
                        fontWeight="400"
                        minWidth="420px"
                        border="1px"
                        textAlign="left"
                        fontSize="md"
                        borderColor="blackAlpha.200"
                      >
                        {/* <Button colorScheme="gray">asd</Button> */}
                        {okay}
                      </MenuButton>
                      <MenuList>
                        {/* MenuItems are not rendered unless Menu is open */}
                        {array.map((obj, index) => (
                          <MenuItem
                            key={index}
                            value={obj.id}
                            onClick={(e) => {
                              setSupp(e.target.value);
                              setOkay(obj.name);
                            }}
                          >
                            {obj.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>

                    <FormControl
                      mt="24px"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabel htmlFor="trending" name="trending">
                        Trending
                      </FormLabel>
                      <Switch
                        id="trending"
                        name="trending"
                        mr="16px"
                        onChange={(e) => {
                          e.preventDefault();
                          if (e.target.checked === true) setTrend(true);
                          else setTrend(false);
                        }}
                      />
                    </FormControl>

                    <FormControl
                      mt="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabel htmlFor="guestCheckout" name="guestCheckout">
                        Guest Checkout
                      </FormLabel>
                      <Switch
                        id="guestCheckout"
                        name="guestCheckout"
                        mr="16px"
                        onChange={(e) => {
                          e.preventDefault();
                          if (e.target.checked === true) setCheck(true);
                          else setCheck(false);
                        }}
                      />
                    </FormControl>

                    <FormControl
                      mt="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabel
                        htmlFor="private_product"
                        name="private_product"
                      >
                        Private Product
                      </FormLabel>
                      <Switch
                        id="private_product"
                        name="private_product"
                        mr="16px"
                        onChange={(e) => {
                          e.preventDefault();
                          if (e.target.checked === true) setProd(true);
                          else setProd(false);
                        }}
                      />
                    </FormControl>

                    <FormControl
                      mt="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabel htmlFor="marketPlace" name="marketPlace">
                        Market Place
                      </FormLabel>
                      <Switch
                        id="marketPlace"
                        name="marketPlace"
                        mr="16px"
                        onChange={(e) => {
                          e.preventDefault();
                          if (e.target.checked === true) setMark(true);
                          else setMark(false);
                        }}
                      />
                    </FormControl>
                  </Flex>
                  <Flex direction="column" ml="40px">
                    <Flex
                      bgColor="white"
                      borderRadius="2xl"
                      p="32px"
                      flexDirection="column"
                    >
                      <Flex>
                        {dd.map((val, index) => {
                          return (
                            <Flex direction="column" key={index}>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="700"
                                color={textColor}
                                display="flex"
                              >
                                {val}
                              </FormLabel>
                              {locat[val].map((item, index) => {
                                return (
                                  <Checkbox
                                    key={index}
                                    mt="10px"
                                    w="max-content"
                                    onChange={(e) => {
                                      e.preventDefault();
                                      if (e.target.checked === true) {
                                        setRRRR((prev) => [
                                          ...prev,
                                          e.target.value
                                        ]);
                                      } else {
                                        setRRRR((prev) => {
                                          prev.splice(
                                            prev.indexOf(e.target.value),
                                            1
                                          );
                                          return prev;
                                        });
                                      }
                                      console.log(rrrr);
                                      SetShow(!show);
                                    }}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </Checkbox>
                                );
                              })}
                            </Flex>
                          );
                        })}
                      </Flex>
                    </Flex>

                    <Flex
                      bgColor="white"
                      borderRadius="2xl"
                      p="32px"
                      mt="32px"
                      flexDirection="column"
                    >
                      <Flex>
                        {cc.map((val, index) => {
                          return (
                            <Flex direction="column" key={index}>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="700"
                                color={textColor}
                                display="flex"
                              >
                                {val}
                              </FormLabel>
                              {categories[val].map((item, index) => {
                                return (
                                  <Checkbox
                                    key={index}
                                    mt="10px"
                                    w="max-content"
                                    onChange={(e) => {
                                      e.preventDefault();
                                      if (e.target.checked === true) {
                                        setCateg((categ) => [
                                          ...categ,
                                          e.target.value
                                        ]);
                                        solve_cat(item.id, item.name);
                                      } else {
                                        setCateg((categ) => {
                                          categ.splice(
                                            categ.indexOf(e.target.value),
                                            1
                                          );
                                          return categ;
                                        });
                                        setCategories((c) => {
                                          delete c[item.name];
                                          return c;
                                        });
                                      }
                                      console.log(categ);
                                      SetShow(!show);
                                    }}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </Checkbox>
                                );
                              })}
                            </Flex>
                          );
                        })}
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
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
                  mt="36px"
                  flexDirection="column"
                >
                  <Grid
                    h="40px"
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(6, 1fr)"
                    gap={4}
                  >
                    <GridItem rowSpan={1} colSpan={2}>
                      <Heading ml="-6px">Variants</Heading>
                    </GridItem>
                  </Grid>
                  <Grid
                    h="150px"
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(6, 1fr)"
                    gap={4}
                  >
                    {vv.map((val, index) => {
                      return (
                        <GridItem rowSpan={1} colSpan={1} key={index}>
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
                              <Text float="left" ml="-20px">
                                {val}
                                <span>
                                  {/* for updating variant name */}
                                  <FontAwesomeIcon
                                    icon={faPencil}
                                    style={{
                                      width: '15px',
                                      float: 'right',
                                      position: 'absolute',
                                      marginLeft: '88px',
                                      marginTop: '-16px'
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let result = prompt(
                                        `Change the name of ${val} variant`
                                      );
                                      if (
                                        result !== null &&
                                        result.length > 0
                                      ) {
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
                                      if (vv.length === 3)
                                        setSize(100 + (maxy - 3) * 50);
                                      else SetShow(!show);
                                    }}
                                  />
                                </span>
                              </Text>
                            </MenuItemOption>
                            {variants[val].map((item, index) => {
                              return (
                                <MenuItemOption
                                  key={index}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    console.log(e.target);
                                    if (e.target.checked === true) {
                                      if (
                                        initialState.filters.hasOwnProperty(
                                          val
                                        ) !== true
                                      ) {
                                        initialState.filters[val] = new Set();
                                      }
                                      initialState.filters[val].add(
                                        e.target.value
                                      );
                                    } else {
                                      initialState.filters[val].delete(
                                        e.target.value
                                      );
                                    }
                                    SetShow(!show);
                                  }}
                                  as={Checkbox}
                                  value={item}
                                  backgroundColor={textColorSecondary}
                                  ml="10px"
                                  mt="10px"
                                >
                                  <Text mt="-37px" ml="10px">
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
                                          for (
                                            let i = 0;
                                            i < variants[val].length;
                                            i++
                                          ) {
                                            if (variants[val][i] === item) {
                                              variants[val].splice(i, 1);
                                              let s = [
                                                ...initialState.filters[val]
                                              ];
                                              if (s.includes(item) === true) {
                                                initialState.filters[
                                                  val
                                                ].delete(item);
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
                              onClick={(e) => {
                                e.preventDefault();
                                let option = prompt(
                                  `Add option for ${val} variant`
                                );
                                if (option !== null && option.length > 0) {
                                  variants[val].push(option);
                                  if (variants[val].length > maxy)
                                    setSize(sizzz + 50);
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

                    <GridItem rowSpan={1} colSpan={1}>
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
                          <Text float="left" ml="6px">
                            Quantity
                          </Text>
                        </MenuItemOption>
                        <MenuItemOption
                          as={Text}
                          maxWidth="170px"
                          backgroundColor={textColorSecondary}
                          ml="30px"
                          mt="10px"
                          height="auto"
                        >
                          {flag === true
                            ? ''
                            : sessionStorage.getItem('quantity')}
                        </MenuItemOption>
                      </Menu>
                    </GridItem>

                    <GridItem rowSpan={1} colSpan={1}>
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
                          <Text float="left" ml="13px">
                            Price
                          </Text>
                        </MenuItemOption>
                        <MenuItemOption
                          as={Text}
                          maxWidth="170px"
                          backgroundColor={textColorSecondary}
                          ml="30px"
                          mt="10px"
                          height="auto"
                        >
                          {flag2 === true
                            ? ''
                            : sessionStorage.getItem('price')}
                        </MenuItemOption>
                      </Menu>
                    </GridItem>

                    <GridItem rowSpan={1} colSpan={1}>
                      <Menu closeOnSelect={false}>
                        <MenuItemOption
                          as={Button}
                          backgroundColor="black"
                          color="white"
                          ml="20px"
                          mt="20px"
                          minWidth="190px"
                          width="auto"
                          _hover={{ bg: 'gray.400' }}
                          _focus={{ color: 'white' }}
                        >
                          <Text float="left" ml="-10px">
                            Discount Price
                          </Text>
                        </MenuItemOption>
                        <MenuItemOption
                          as={Text}
                          maxWidth="170px"
                          backgroundColor={textColorSecondary}
                          ml="30px"
                          mt="10px"
                          height="auto"
                        >
                          {flag3 === true
                            ? ''
                            : sessionStorage.getItem('disprice')}
                        </MenuItemOption>
                      </Menu>
                    </GridItem>

                    {/* Button for adding more variants limited to max 8 variants */}
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
                            if (
                              val !== null &&
                              val.length !== 0 &&
                              vv.length < 2
                            ) {
                              variants[val] = [];
                              initialState.filters[val] = new Set();
                              SetShow(!show);
                            } else if (
                              vv.length >= 2 &&
                              vv.length <= 4 &&
                              val !== null &&
                              val.length !== 0
                            ) {
                              variants[val] = [];
                              initialState.filters[val] = new Set();
                              if (vv.length == 2) setSize(sizzz + 120);
                              else SetShow(!show);
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
                <TableContainer
                  border="1px"
                  borderColor="gray.200"
                  minWidth="255vh"
                  marginLeft="-32px"
                >
                  <Table variant="simple">
                    <Thead fontWeight="bold">
                      <Tr>
                        {vv.map((key1, index) => {
                          return <Td key={index}>{key1}</Td>;
                        })}
                        <Td mr="12px">Quantity</Td>
                        <Td mr="12px">Price</Td>
                        <Td mr="12px">Discount Price</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {res1.map((table, idx) => {
                        return (
                          <Tr key={idx} height="auto">
                            {table.map((entry, idx2) => {
                              return (
                                <Td
                                  key={idx2}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    let vall = prompt('Change cell value !');
                                    if (vall !== null && vall.length > 0) {
                                      mp.push([idx, idx2, vall]);
                                      SetShow(!show);
                                    }
                                  }}
                                >
                                  {entry}
                                </Td>
                              );
                            })}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Requests Progress Bar</ModalHeader>
                    <ModalCloseButton
                      onClick={() => {
                        setTimer(false);
                      }}
                    />
                    <ModalBody mb="17px">
                      <Progress
                        value={100}
                        minWidth="100%"
                        max={100}
                        isIndeterminate={stripe}
                        colorScheme={colors}
                        hasStripe={stripe}
                        isAnimated={anim}
                        mb="23px"
                      />
                      {messagee.first}
                    </ModalBody>
                  </ModalContent>
                </Modal>

                <FormControl>
                  <Button
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="55%"
                    h="37"
                    mb="18px"
                    mt="20px"
                    ml="430px"
                    onClick={() => {
                      let ss = 0,
                        id;
                      let yy = true;
                      let qua = parseInt(
                        sessionStorage.getItem('quantity'),
                        10
                      );
                      for (let i = 0; i < res1.length; i++) {
                        ss += parseInt(res1[i][res1[i].length - 3]);
                        let aa = parseInt(res1[i][res1[i].length - 2]);
                        let bb = parseInt(res1[i][res1[i].length - 1]);
                        if (aa <= bb) {
                          yy = false;
                          id = i;
                        }
                      }
                      if (ss < qua) {
                        alert(`${qua - ss} items remaining to add !`);
                      } else if (ss > qua) {
                        alert(
                          `${
                            ss - qua
                          } items are extra, this can not exceed maximum quantity !`
                        );
                      } else if (yy === false) {
                        alert(
                          `Price value can not be smaller than Discount price at index ${
                            id + 1
                          }`
                        );
                      } else {
                        return handleSubmit();
                      }
                    }}
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
    </>
  );
}

export default Entry;
