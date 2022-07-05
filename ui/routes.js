import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdHome, MdBarChart } from 'react-icons/md';

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
  }
];

export default routes;
