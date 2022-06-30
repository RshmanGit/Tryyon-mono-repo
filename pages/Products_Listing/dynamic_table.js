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
    colour: new Set(),
    size: new Set()
  }
};

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
  let c = [...initialState.filters.colour];
  let s = [...initialState.filters.size];
  let vv = Object.keys(variants);
  for (let i = 0; i < vv.length; i++) {
    if (variants[vv[i]].length > maxy) maxy = variants[vv[i]].length;
  }
  // console.log(vv);
  return (
    <>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="auto"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '0px' }}
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
                <Menu closeOnSelect={false} key={val}>
                  <MenuButton
                    as={Button}
                    colorScheme="blue"
                    ml="30px"
                    mt="20px"
                    minWidth="160px"
                    width="auto"
                    key={val}
                  >
                    <Text float="left" key={val}>
                      {val}
                    </Text>
                    <span>
                      <FontAwesomeIcon
                        icon={faPencil}
                        style={{
                          width: '15px',
                          float: 'left',
                          marginLeft: '15px',
                          marginTop: '3px'
                        }}
                      />
                    </span>
                    <span>
                      <FontAwesomeIcon
                        icon={faBan}
                        style={{
                          width: '15px',
                          float: 'left',
                          marginLeft: '15px',
                          marginTop: '3px'
                        }}
                      />
                    </span>
                  </MenuButton>

                  {variants[val].map((item) => {
                    return (
                      <MenuItemOption
                        key={val}
                        onChange={(e) => {
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
                        if (variants[val].length > maxy) setSize(sizzz + 60);
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
                onClick={() => {
                  let val = prompt('Add variant');
                  if (val !== null && val.length !== 0 && vv.length < 5) {
                    variants[val] = [];
                    SetShow(!show);
                  } else if (
                    vv.length == 5 &&
                    val !== null &&
                    val.length !== 0
                  ) {
                    variants[val] = [];
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
      <TableContainer borderColor="black">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Td paddingLeft="5">Size</Td>
              <Td paddingLeft="5">Colour</Td>
            </Tr>
          </Thead>
          <Tbody>
            {s.map((size) => {
              if (c.length > 0) {
                return c.map((colour) => {
                  return (
                    <Tr key={colour}>
                      <Td>{size}</Td>
                      <Td>{colour}</Td>
                    </Tr>
                  );
                });
              } else {
                return (
                  <Tr key={size}>
                    <Td>{size}</Td>
                  </Tr>
                );
              }
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Entry;
