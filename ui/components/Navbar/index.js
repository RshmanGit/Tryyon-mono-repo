import { Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function checkLoggedIn() {
  if (typeof window !== 'undefined') {
    return !!(sessionStorage.userToken || sessionStorage.adminToken);
  }

  return false;
}

export default function Navbar({ isLoggedIn }) {
  const router = useRouter();

  return (
    <Flex h="54px">
      <Flex
        p="12px 16px"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        bgColor="white"
        w="100%"
        h="54px"
        zIndex="1"
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Text fontSize="16px" fontWeight="700">
          Tryyon
        </Text>
        {isLoggedIn ? (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => {
              sessionStorage.clear();
              router.push('/');
            }}
          >
            Logout
          </Button>
        ) : (
          <Flex alignItems="center" gap="16px">
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => {
                router.push('/auth/login');
              }}
            >
              Login as user
            </Button>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => {
                router.push('/auth/admin/login');
              }}
            >
              Login as admin
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
