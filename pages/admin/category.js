import Layout from '../../ui/layouts/admin';
import TableComp from '../../ui/components/table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';

import { SearchBar } from '../../ui/components/searchbar';
import useDebounce from '../../utils/hooks/useDebounce';
import ModalComp from '../../ui/components/modal';

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

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');

  const [modalHeading, setModalHeading] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalFooter, setModalFooter] = useState();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [parent, setParent] = useState('');
  const [id, setID] = useState('');

  const debouncedSearchString = useDebounce(searchString, 800);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'secondaryGray.900');

  const createCategory = async () => {
    console.log(name, description, slug);
    if (name == '' || description == '' || slug == '')
      alert('One or more fields are empty!');
    else {
      const body = {
        name,
        description,
        slug
      };

      if (parent != '') {
        body.parentCategoryId = parent;
      }

      const res = await fetch(
        `${router.basePath}/api/products/category/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionStorage.adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (res.ok) {
        console.log('Category created', await res.json());
        alert('Category created');
        router.reload();
      } else {
        if (res.status == 401 || res.status == 403) {
          alert('Admin not logged in');
          router.push('/auth/admin/login');
        }
        const data = await res.json();
        console.error(data.message);
        alert(data.message);
      }
    }
  };

  const editCategory = async () => {
    console.log(name, description, slug);
    if (name == '' || description == '' || slug == '' || id == '')
      alert('One or more fields are empty!');
    else {
      const body = {
        id
      };

      if (name != '') {
        body.name = name;
      }

      if (description != '') {
        body.description = description;
      }

      if (slug != '') {
        body.slug = slug;
      }

      if (parent != '') {
        body.parentCategoryId = parent;
      }

      const res = await fetch(
        `${router.basePath}/api/products/category/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionStorage.adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (res.ok) {
        console.log('Category updated', await res.json());
        alert('Category updated');
        router.reload();
      } else {
        if (res.status == 401 || res.status == 403) {
          alert('Admin not logged in');
          router.push('/auth/admin/login');
        }
        const data = await res.json();
        console.error(data.message);
        alert(data.message);
      }
    }
  };

  const deleteCategory = async () => {
    if (id == '') alert('ID is missing!');
    else {
      const body = {
        id
      };

      const res = await fetch(
        `${router.basePath}/api/products/category/delete`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionStorage.adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (res.ok) {
        console.log('Category deleted', await res.json());
        alert('Category deleted');
        router.reload();
      } else {
        if (res.status == 401 || res.status == 403) {
          alert('Admin not logged in');
          router.push('/auth/admin/login');
        }
        const data = await res.json();
        console.error(data.message);
        alert(data.message);
      }
    }
  };

  const handler = {
    create: createCategory,
    edit: editCategory,
    delete: deleteCategory
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSlug('');
    setParent('');
    onClose();
  };

  const openCreate = () => {
    setModalHeading('Create Category');

    setModalBody('create');

    setModalFooter('Create');
    onOpen();
  };

  const openEdit = (id) => {
    setModalHeading('Edit Category');
    setModalBody('edit');
    setModalFooter('Update');
    setID(id);
    onOpen();
  };

  const openDelete = (id) => {
    setModalHeading('Delete Category');
    setModalBody('delete');
    setModalFooter('Delete');
    setID(id);
    onOpen();
  };

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
    // console.log(query);
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

        if (res.status == 404) {
          return { categories: [] };
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
            Categories Table
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
              onClick={openCreate}
            >
              Create
            </Button>
          </SearchBar>
        </Flex>
        <TableComp
          editEntry={openEdit}
          deleteEntry={openDelete}
          columnsData={columnsData}
          tableData={data}
        />
      </Layout>
      {isOpen && (
        <ModalComp
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={resetForm}
          footer={modalFooter}
          heading={modalHeading}
          handleSubmit={handler[modalBody]}
        >
          {modalBody == 'create' && (
            <>
              <Text fontSize="14px" fontWeight={500}>
                Name*
              </Text>
              <Input
                mb="8px"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Text fontSize="14px" fontWeight={500}>
                Description*
              </Text>
              <Textarea
                mb="8px"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Text fontSize="14px" fontWeight={500}>
                Slug*
              </Text>
              <Input
                mb="8px"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Text fontSize="14px" fontWeight={500}>
                Parent Category ID
              </Text>
              <Input
                mb="8px"
                value={parent}
                onChange={(e) => setParent(e.target.value)}
              />
            </>
          )}

          {modalBody == 'edit' && (
            <>
              <Text fontSize="14px" fontWeight={500}>
                Name
              </Text>
              <Input
                mb="8px"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Text fontSize="14px" fontWeight={500}>
                Description
              </Text>
              <Textarea
                mb="8px"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Text fontSize="14px" fontWeight={500}>
                Slug
              </Text>
              <Input
                mb="8px"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Text fontSize="14px" fontWeight={500}>
                Parent Category ID
              </Text>
              <Input
                mb="8px"
                value={parent}
                onChange={(e) => setParent(e.target.value)}
              />
            </>
          )}

          {modalBody == 'delete' && (
            <>
              <Text fontSize="14px" fontWeight={500}>
                Are you sure?
              </Text>
            </>
          )}
        </ModalComp>
      )}
    </>
  );
}
