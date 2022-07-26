import Layout from '../../ui/layouts/user';
import TableComp from '../../ui/components/table';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  Checkbox,
  FormLabel,
  Select,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Code,
  Box
} from '@chakra-ui/react';

import { ChevronDownIcon, DownloadIcon } from '@chakra-ui/icons';

import { SearchBar } from '../../ui/components/searchbar';
import useDebounce from '../../utils/hooks/useDebounce';
import Facet from '../../ui/components/facet';
import { MdOutlineImportContacts, MdOutlineImportExport } from 'react-icons/md';
import { override } from 'joi';

const columnsData = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'NAME',
    accessor: 'name'
  },
  {
    Header: 'DESCRIPTION',
    accessor: 'description'
  },
  {
    Header: 'SHORT DESCRIPTIONS',
    accessor: 'shortDescriptions'
  },
  {
    Header: 'SLUG',
    accessor: 'slug'
  },
  {
    Header: 'Quantity',
    accessor: 'quantity'
  },
  {
    Header: 'PUBLISHED',
    accessor: 'published'
  },
  {
    Header: 'SUPPLIER ID',
    accessor: 'supplierId'
  },
  {
    Header: 'CATEGORIES',
    accessor: 'categories'
  },
  {
    Header: 'MANUFACTURER',
    accessor: 'manufacturer'
  },
  {
    Header: 'LOCATIONS',
    accessor: 'locations'
  },
  {
    Header: 'COUNTRY OF ORIGIN',
    accessor: 'countryOfOrigin'
  },
  {
    Header: 'TRENDING',
    accessor: 'trending'
  },
  {
    Header: 'FEATURED FROM',
    accessor: 'featuredFrom'
  },
  {
    Header: 'FEATURED TO',
    accessor: 'featuredTo'
  },
  {
    Header: 'GUEST CHECKOUT',
    accessor: 'guestCheckout'
  },
  {
    Header: 'PRIVATE',
    accessor: 'private_product'
  },
  {
    Header: 'MARKET PLACE',
    accessor: 'marketPlace'
  },
  {
    Header: 'TYPE',
    accessor: 'reseller.type'
  },
  {
    Header: 'COMMISSION',
    accessor: 'reseller.commission'
  },
  {
    Header: 'DISCOUNT',
    accessor: 'reseller.discount'
  }
];

export default function UserProducts() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [attributesQuery, setAttributesQuery] = useState({});
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);

  const [createdImport, setCreatedImport] = useState({});

  const debouncedSearchString = useDebounce(searchString, 1500);
  const debouncedCategoryQuery = useDebounce(categoryQuery, 1500);
  const debouncedAttributesQuery = useDebounce(attributesQuery, 1500);
  const debouncedPriceFrom = useDebounce(priceFrom, 1500);
  const debouncedPriceTo = useDebounce(priceTo, 1500);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'secondaryGray.900');

  useEffect(() => {
    if (!sessionStorage.userToken) {
      toast({
        title: 'Unauthorised user',
        status: 'error',
        duration: 2000,
        isClosable: true
      });

      router.push(`/auth/login?next=${router.pathname}`);
    } else {
      let query = {},
        rest = '';

      const accepted_values = [
        'id',
        'inStock',
        'published',
        'supplierId',
        'priceFrom',
        'priceTo'
      ];

      const q = debouncedSearchString.split(/\s+/);

      q.forEach((e) => {
        let a = e.split(':');
        if (a.length == 2 && accepted_values.indexOf(a[0]) != -1) {
          if (a[0] == 'inStock' || a[0] == 'published') {
            query[a[0]] = a[1] == 'true';
          } else if (a[0] == 'priceFrom' || a[0] == 'priceTo') {
            try {
              query[a[0]] = parseInt(a[1], 10);
            } catch (err) {
              toast({
                title: err.message,
                status: 'error',
                duration: 2000,
                isClosable: true
              });
            }
          } else query[a[0]] = a[1];
        } else {
          if (rest != '') rest += ' ';
          rest += e;
        }
      });

      if (rest) {
        query.query = rest;
      }

      if (debouncedCategoryQuery != '') {
        query.categoryId = debouncedCategoryQuery.id;
      }

      if (debouncedAttributesQuery != {}) {
        query.attributes = debouncedAttributesQuery;
      }

      if (debouncedPriceFrom > 0) {
        query.priceFrom = debouncedPriceFrom;
      }

      if (debouncedPriceTo > 0) {
        query.priceTo = debouncedPriceTo;
      }

      console.log(query);
      fetch(`${router.basePath}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })
        .then(async (res) => {
          const res_data = await res.json();
          if (res.ok) {
            console.log(res_data);
            return res_data;
          }

          if (res.status == 403 || res.status == 401) {
            toast({
              title: 'Unauthorised user',
              status: 'error',
              duration: 2000,
              isClosable: true
            });
            router.push(`/auth/login?next=${router.pathname}`);
          }

          if (res.status == 404) {
            console.log(res_data.message);
            toast({
              title: res_data.message,
              status: 'error',
              duration: 2000,
              isClosable: true
            });
            return { products: [] };
          }
          throw new Error(res_data.message);
        })
        .then((res) => {
          setData(res.products);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.message,
            status: 'error',
            duration: 2000,
            isClosable: true
          });
        });
    }
  }, [
    router,
    debouncedSearchString,
    toast,
    debouncedAttributesQuery,
    debouncedCategoryQuery,
    debouncedPriceFrom,
    debouncedPriceTo
  ]);

  useEffect(() => {
    if (localStorage.getItem('page/products/browse'))
      setPage(parseInt(localStorage.getItem('page/products/browse'), 10));
  }, []);

  return (
    <>
      <Layout>
        <Flex
          px="25px"
          justify="space-between"
          mb="20px"
          align="center"
          alignItems="center"
        >
          <Text
            color={textColor}
            fontSize="32px"
            fontWeight="700"
            lineHeight="100%"
          >
            Browse Products
          </Text>
          <SearchBar
            background={bgColor}
            value={searchString}
            setValue={setSearchString}
            placeholder="e.g. hello isRoot:true id:62bad0b6f4b8ec8aad5ced34"
          >
            <Button
              fontSize={{ sm: '14px' }}
              colorScheme="blue"
              onClick={() => router.push('/products/create')}
            >
              Create
            </Button>
          </SearchBar>
        </Flex>

        <Facet
          category={categoryQuery}
          attributes={attributesQuery}
          setCategory={setCategoryQuery}
          setAttributes={setAttributesQuery}
          priceFrom={priceFrom}
          priceTo={priceTo}
          setPriceFrom={setPriceFrom}
          setPriceTo={setPriceTo}
          token={typeof window !== 'undefined' ? sessionStorage.userToken : ''}
        />

        <TableComp
          actions={[
            (cells) => {
              console.log(cells);

              if (
                cells[18].value == 'discount' ||
                cells[18].value == 'commission'
              ) {
                const body = {
                  type: cells[18].value,
                  skuIds: [],
                  productId: cells[0].value,
                  status: false
                };

                if (cells[18].value == 'discount') {
                  const override = {};
                  let v = prompt('Enter price');

                  override.price = v;
                  override.sellingPrice =
                    v + (parseInt(cells[20].value) * v) / 100;

                  body.override = override;
                }

                fetch('/api/product_imports/create', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${sessionStorage.userToken}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                })
                  .then(async (res) => {
                    if (res.ok) return await res.json();

                    if (res.status == 403 || res.status == 401) {
                      router.push(`/auth/login?next=${router.pathname}`);
                    }

                    const err = await res.json();
                    console.log(err);
                    throw new Error(err.message);
                  })
                  .then((res) => {
                    onOpen();
                    setCreatedImport(res.productImport);
                  })
                  .catch((err) => {
                    toast({
                      title: err.message,
                      status: 'error',
                      duration: 2000,
                      isClosable: true
                    });

                    console.error(err.message);
                  });
              } else {
                toast({
                  title: 'Import not allowed',
                  status: 'error',
                  duration: 2000,
                  isClosable: true
                });
              }
            }
          ]}
          actionButtons={[<DownloadIcon key={0} />]}
          columnsData={columnsData}
          tableData={data}
          restore_page={page}
        />
      </Layout>
      {isOpen && (
        <Modal
          scrollBehavior="inside"
          size={'md'}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Product Imported</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Imported product: {createdImport.product.name}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
