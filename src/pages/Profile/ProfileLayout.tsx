import { CardContent } from '@/components/profile/CardContent';
import { CardWithAvatar } from '@/components/profile/CardWithAvatar';
import { NavTab } from '@/components/profile/NavTab';
import { Box, Heading, TabList, Tabs } from '@chakra-ui/react';
import { Outlet, useParams } from 'react-router-dom';

export const ProfileLayout = () => {
  const params = useParams();
  const userId = params.userId as string;

  return (
    <>
      <Box as="section" pt="20" pb="12" position="relative">
        <Box position="absolute" inset="0" height="32" bg="blue.600" />
        <CardWithAvatar
          maxW="xl"
          avatarProps={{
            src: userId,
            name: userId,
            uploading: 'false',
          }}
        >
          <CardContent>
            <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
              {userId}
            </Heading>
          </CardContent>
        </CardWithAvatar>
      </Box>
      <Tabs size="lg">
        <TabList>
          <NavTab to={`/u/${userId}`}>Timeline</NavTab>
          <NavTab to={`/u/${userId}/following`}>Following (0)</NavTab>
          <NavTab to={`/u/${userId}/followers`}>Followers (0)</NavTab>
        </TabList>
      </Tabs>

      <Outlet />
    </>
  );
};
