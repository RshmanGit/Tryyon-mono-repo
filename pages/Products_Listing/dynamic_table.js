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
  Tfoot,
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
  MenuDivider,
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
import { useEffect } from 'react';
import { useState } from 'react';

const initialState = {
  filters: {
    size: new Set(),
    colour: new Set()
  }
};

const variants = {
  size: ['small', 'medium', 'large'],
  colour: ['red', 'blue', 'green']
};
let maxy = 0,
  idx = 0;
function Entry() {
  // Chakra color mode
  const [show, SetShow] = useState(true);
  const textColorSecondary = 'gray.100';
  const [sizzz, setSize] = useState(100);
  // let c = [...initialState.filters.colour];
  // let s = [...initialState.filters.size];
  let vv = Object.keys(variants);
  let kk = Object.keys(initialState.filters);
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
  for (let i = 0; i < vv.length; i++) {
    if (variants[vv[i]].length > maxy) maxy = variants[vv[i]].length;
  }
  // console.log(vv);
  let res = [[]];
  let arr = [];
  // if(idx%2==0){
  kk.map((key) => {
    // console.log(key)
    let s = [...initialState.filters[key]];
    if (s.length === 0) {
      s.push('');
    }
    arr.push(s);
  });
  res = permute(arr);
  for (let i = 0; i < res.length; i++) {
    console.log(res[i]);
  }
  // }
  // idx++;
  return (
    <>
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
        mt={{ base: '10px', md: '0px' }}
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

                      {/* <span> */}
                      <span>
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
                              SetShow(!show);
                            }
                          }}
                        />
                      </span>

                      <span>
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
                        key={val}
                        onChange={(e) => {
                          e.preventDefault();
                          if (e.target.checked === true) {
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
                          {/* <span>
                      <FontAwesomeIcon
                        icon={faPencil}
                        style={{
                          width: '15px',
                          float: 'right',
                          marginLeft: '25px',
                          marginTop: '3px'
                        }}
                      />
                    </span> */}
                          <span>
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
                  <Button
                    paddingInlineStart="10px"
                    ml="20px"
                    mt="10px"
                    width="85%"
                    fontSize="0.92em"
                    background={textColorSecondary}
                    key={val}
                    onClick={() => {
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
                    // if(initialState.filters.hasOwnProperty(val) !== true){
                    initialState.filters[val] = new Set();
                    // }
                    SetShow(!show);
                  } else if (
                    vv.length == 5 &&
                    val !== null &&
                    val.length !== 0
                  ) {
                    variants[val] = [];
                    // if(initialState.filters.hasOwnProperty(val) !== true){
                    initialState.filters[val] = new Set();

                    // }
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
      <TableContainer border="1px" borderColor="gray.200">
        <Table variant="simple">
          <Thead fontWeight="bold">
            <Tr>
              {vv.map((key) => {
                return <Td>{key}</Td>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {res.map((table) => {
              return (
                <Tr>
                  {table.map((entry) => {
                    return <Td>{entry}</Td>;
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
