import { RelationshipGrid } from '@/components/profile/RelationshipGrid';
import { exhaustiveGuard } from '@/lib/common/utils/exhaustive-guard';
import {
  createProfileFollowersViewModel,
  ProfileFollowersViewModelType,
} from '@/pages/Profile/ProfileFollowers/profile-followers.viewmodel';
import { Button, Center } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const ProfileFollowers = () => {
  const { userId } = useParams() as { userId: string };
  const viewModel = useSelector(
    createProfileFollowersViewModel({ of: userId }),
  );

  switch (viewModel.type) {
    case ProfileFollowersViewModelType.LoadingFollowers:
      return <div>Loading followers...</div>;
    case ProfileFollowersViewModelType.LoadedFollowers:
      return (
        <>
          <RelationshipGrid relationshipCards={viewModel.followers} />
          <Center>
            <Button mb={10} colorScheme="twitter">
              Voir plus
            </Button>
          </Center>
        </>
      );
    default:
      return exhaustiveGuard(viewModel);
  }
  return null;
};
