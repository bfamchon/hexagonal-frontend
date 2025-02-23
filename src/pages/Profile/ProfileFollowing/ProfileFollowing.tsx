import { RelationshipGrid } from '@/components/profile/RelationshipGrid';
import { exhaustiveGuard } from '@/lib/common/utils/exhaustive-guard';
import {
  createProfileFollowingViewModel,
  ProfileFollowingViewModelType,
} from '@/pages/Profile/ProfileFollowing/profile-following.viewmodel';
import { Button, Center } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const ProfileFollowing = () => {
  const { userId } = useParams() as { userId: string };
  const viewModel = useSelector(
    createProfileFollowingViewModel({ of: userId }),
  );

  switch (viewModel.type) {
    case ProfileFollowingViewModelType.LoadingFollowing:
      return <div>Loading following...</div>;
    case ProfileFollowingViewModelType.LoadedFollowing:
      return (
        <>
          <RelationshipGrid relationshipCards={viewModel.following} />
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
