import { AppDispatch } from '@/lib/create-store';
import { postMessage } from '@/lib/timelines/usecases/post-message.usecase';

export const createAddPostFormViewModel = ({
  dispatch,
  messageId,
  timelineId,
  maxCharacters,
  charactersCount,
  setCharactersCount,
}: {
  dispatch: AppDispatch;
  messageId: string;
  timelineId: string;
  maxCharacters: number;
  charactersCount: number;
  setCharactersCount: (count: number) => void;
}) => {
  const hasReachedMaxCount = charactersCount > maxCharacters;
  const canSubmit = charactersCount > 0 && !hasReachedMaxCount;
  const charCounterColor = hasReachedMaxCount ? 'red.300' : 'muted';
  const inputBackgroundColor = hasReachedMaxCount ? 'red.300' : 'white';
  return {
    postMessage: (text: string) => {
      dispatch(postMessage({ messageId, text: text.trim(), timelineId }));
      setCharactersCount(0);
    },
    canSubmit,
    handleTextChange(nextText: string) {
      setCharactersCount(nextText.trim().length);
    },
    hasReachedMaxCount,
    inputBackgroundColor,
    charCounterColor,
    remaining: maxCharacters - charactersCount,
  };
};
