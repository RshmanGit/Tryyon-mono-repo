import Layout from '../../ui/layouts/admin';
import TableComp from '../../ui/components/table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { SearchBar } from '../../ui/components/searchbar';
import useDebounce from '../../utils/hooks/useDebounce';

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
    Header: 'PARENT CATEGORY ID',
    accessor: 'parentCategoryId'
  },
  {
    Header: 'SLUG',
    accessor: 'slug'
  }
];

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');
  const debouncedSearchString = useDebounce(searchString, 800);

  const router = useRouter();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'secondaryGray.900');

  useEffect(() => {
    let query = '',
      rest = '';
    const q = debouncedSearchString.split(/\s+/);
    q.forEach((e) => {
      let a = e.split(':');
      if (a.length == 2) {
        if (query != '') query += '&';
        query += `${a[0]}=${a[1]}`;
      } else {
        if (rest != '') rest += ' ';
        rest += e;
      }
    });
    if (rest) {
      if (query) query += '&';
      query += `query=${rest}`;
    }
    console.log(query);
    fetch(`${router.basePath}/api/products/category?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.adminToken}`
      }
    })
      .then(async (res) => {
        const res_data = await res.json();
        if (res.ok) {
          return res_data;
        }

        if (res.status == 403 || res.status == 401) {
          alert('Admin not logged in...');
          router.push('/auth/admin/login');
        }
        throw new Error(res_data.message);
      })
      .then((res) => {
        setData(res.categories);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router, debouncedSearchString]);

  return (
    <Layout>
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="32px"
          fontWeight="700"
          lineHeight="100%"
        >
          Categories Table
        </Text>
        <SearchBar
          background={bgColor}
          value={searchString}
          setValue={setSearchString}
          placeholder="e.g. hello isRoot:true id:62bad0b6f4b8ec8aad5ced34"
        />
      </Flex>
      <TableComp columnsData={columnsData} tableData={data} />
    </Layout>
  );
}
