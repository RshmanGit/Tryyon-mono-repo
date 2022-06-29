import React from 'react';
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
  Checkbox
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
    colours: new Set(),
    sizes: new Set()
  }
};

function Entry() {
  // Chakra color mode
  const [show, SetShow] = useState(true);

  useEffect(() => {
    console.log(initialState.filters.sizes.length);
  });
  let c = [...initialState.filters.colours];
  let s = [...initialState.filters.sizes];
  return (
    <>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '80px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '10px', md: '10px' }}
        flexDirection="column"
      >
        <Heading ml="30px">Variants</Heading>
        <Grid
          h="150px"
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(8, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={1} colSpan={1}>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                colorScheme="blue"
                ml="30px"
                mt="20px"
                width="70%"
              >
                Size
              </MenuButton>
              <MenuList minWidth="120px">
                <MenuOptionGroup>
                  <MenuItemOption
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        initialState.filters.sizes.add(e.target.value);
                      } else {
                        initialState.filters.sizes.delete(e.target.value);
                      }
                      SetShow(!show);
                    }}
                    as={Checkbox}
                    value="Small"
                  >
                    Small
                  </MenuItemOption>
                  <MenuItemOption
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        initialState.filters.sizes.add(e.target.value);
                      } else {
                        initialState.filters.sizes.delete(e.target.value);
                      }
                      SetShow(!show);
                    }}
                    as={Checkbox}
                    value="Medium"
                  >
                    Medium
                  </MenuItemOption>
                  <MenuItemOption
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        initialState.filters.sizes.add(e.target.value);
                      } else {
                        initialState.filters.sizes.delete(e.target.value);
                      }
                      SetShow(!show);
                    }}
                    as={Checkbox}
                    value="Large"
                  >
                    Large
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </GridItem>

          <GridItem rowSpan={1} colSpan={1}>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                colorScheme="blue"
                ml="30px"
                mt="20px"
                width="70%"
              >
                Colour
              </MenuButton>
              <MenuList minWidth="120px">
                <MenuOptionGroup>
                  <MenuItemOption
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        initialState.filters.colours.add(e.target.value);
                      } else {
                        initialState.filters.colours.delete(e.target.value);
                      }
                      SetShow(!show);
                    }}
                    as={Checkbox}
                    value="Green"
                  >
                    Green
                  </MenuItemOption>
                  <MenuItemOption
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        initialState.filters.colours.add(e.target.value);
                      } else {
                        initialState.filters.colours.delete(e.target.value);
                      }
                      SetShow(!show);
                    }}
                    as={Checkbox}
                    value="Blue"
                  >
                    Blue
                  </MenuItemOption>
                  <MenuItemOption
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        initialState.filters.colours.add(e.target.value);
                      } else {
                        initialState.filters.colours.delete(e.target.value);
                      }
                      SetShow(!show);
                    }}
                    as={Checkbox}
                    value="Red"
                  >
                    Red
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
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
