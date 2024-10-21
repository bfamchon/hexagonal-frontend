import { exhaustiveGuard } from '@/lib/common/utils/exhaustive-guard';
import {
  ProfileTimelineViewModelType,
  selectProfileTimelineViewModel,
} from '@/pages/Profile/ProfileTimeline/profile-timeline.viewmodel';
import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { PostList } from './PostList';

const getNow = () => new Date().toISOString();

export const Timeline = ({ userId }: { userId: string }) => {
  const viewModel = useSelector(
    selectProfileTimelineViewModel({ userId, getNow }),
  );

  const timelineNode: ReactNode = (() => {
    switch (viewModel.timeline.type) {
      case ProfileTimelineViewModelType.NoTimeline:
        return null;
      case ProfileTimelineViewModelType.LoadingTimeline:
        return <Text>{viewModel.timeline.info}</Text>;
      case ProfileTimelineViewModelType.EmptyTimeline:
        return <Text>{viewModel.timeline.info}</Text>;
      case ProfileTimelineViewModelType.WithMessages:
        return (
          <PostList
            messages={viewModel.timeline.messages}
            timelineId={viewModel.timeline.id}
          />
        );
      default:
        return exhaustiveGuard(viewModel.timeline);
    }
  })();

  return timelineNode;
};