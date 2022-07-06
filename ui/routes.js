import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdHome, MdBarChart, MdEditAttributes } from 'react-icons/md';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/category',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />
  },
  {
    name: 'Attrbutes',
    layout: '/admin',
    path: '/attributes',
    icon: (
      <Icon as={MdEditAttributes} width="20px" height="20px" color="inherit" />
    )
  }
];

export default routes;
