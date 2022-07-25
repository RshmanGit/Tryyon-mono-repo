import Sidebar from '../../components/sidebar/sidebar';
import SidebarLinks from '../../components/sidebar/links';
import routes from '../../routes/user';
import { Box } from '@chakra-ui/react';

function Layout({ children }) {
  return (
    <div>
      <Box>
        <Sidebar>
          <SidebarLinks routes={routes} />
        </Sidebar>
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 300px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 300px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Layout;
