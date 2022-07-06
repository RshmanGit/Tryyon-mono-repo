import {
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react';

import {
  EditIcon,
  DeleteIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@chakra-ui/icons';
import React, { useMemo } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';

// Custom components
import Card from '../card/Card';

export default function TableComp(props) {
  const { columnsData, tableData, editEntry, deleteEntry } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'scroll' }}
    >
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                  >
                    {column.render('Header')}
                  </Flex>
                </Th>
              ))}
              <Th pe="10px" borderColor={borderColor} key="ACTION">
                <Flex
                  justify="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color="gray.400"
                >
                  ACTION
                </Flex>
              </Th>
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = '';
                  columns.forEach((col) => {
                    if (cell.column.Header === col.Header) {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="400"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    }
                  });

                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: '300px' }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
                <Td
                  display="flex"
                  alignItems="center"
                  minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                  borderColor="transparent"
                  key="ACTION"
                >
                  <Button
                    fontSize={{ sm: '14px' }}
                    m="8px"
                    colorScheme="blue"
                    onClick={() => editEntry(row.cells[0].value)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    fontSize={{ sm: '14px' }}
                    colorScheme="red"
                    onClick={() => deleteEntry(row.cells[0].value)}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {pageCount !== 0 && (
        <Flex m="auto" alignItems="center">
          <Button disabled={!canPreviousPage} onClick={previousPage}>
            <ChevronLeftIcon />
          </Button>
          <Text fontSize="14px">
            <b>{pageIndex + 1}</b> | {pageCount}
          </Text>
          <Button disabled={!canNextPage} onClick={nextPage}>
            <ChevronRightIcon />
          </Button>
        </Flex>
      )}
    </Card>
  );
}
