import { createAddPostFormViewModel } from '@/components/AddPostForm/add-post-form.viewmodel';
import { AppDispatch, createTestStore } from '@/lib/create-store';
import { postMessage as postMessageUseCase } from '@/lib/timelines/usecases/post-message.usecase';
import { describe, expect, test, vitest } from 'vitest';

const createTestAddPostFormViewModel = ({
  dispatch = vitest.fn(),
  messageId = '1',
  timelineId = '1',
  maxCharacters = Infinity,
  charactersCount = 42,
  setCharactersCount = vitest.fn(),
}: {
  dispatch?: AppDispatch;
  messageId?: string;
  timelineId?: string;
  maxCharacters?: number;
  charactersCount?: number;
  setCharactersCount?: (count: number) => void;
} = {}) =>
  createAddPostFormViewModel({
    dispatch,
    messageId,
    timelineId,
    maxCharacters,
    charactersCount,
    setCharactersCount,
  });

describe('AddPostFormViewModel', () => {
  test('postMessage correctly dispatch the postMessage use-case', () => {
    const store = createTestStore();
    const { postMessage } = createTestAddPostFormViewModel({
      dispatch: store.dispatch,
    });

    postMessage('Hello, World!');

    expect(store.getDispatchedUseCaseArgs(postMessageUseCase)).toEqual({
      messageId: '1',
      text: 'Hello, World!',
      timelineId: '1',
    });
  });

  test('postMessage correctly dispatch the postMessage use-case with trimmed message', () => {
    const store = createTestStore();
    const { postMessage } = createTestAddPostFormViewModel({
      dispatch: store.dispatch,
    });

    postMessage('     Hello, World!        ');

    expect(store.getDispatchedUseCaseArgs(postMessageUseCase)).toEqual({
      messageId: '1',
      text: 'Hello, World!',
      timelineId: '1',
    });
  });

  test('get the remaining characters count', () => {
    expect(
      createTestAddPostFormViewModel({ charactersCount: 0, maxCharacters: 42 })
        .remaining,
    ).toBe(42);

    expect(
      createTestAddPostFormViewModel({ charactersCount: 2, maxCharacters: 42 })
        .remaining,
    ).toBe(40);

    expect(
      createTestAddPostFormViewModel({ charactersCount: 44, maxCharacters: 42 })
        .remaining,
    ).toBe(-2);
  });

  test('characters count is reset to 0 when posting a message', () => {
    let charactersCount = 42;
    const { postMessage } = createTestAddPostFormViewModel({
      charactersCount,
      setCharactersCount: (count: number) => {
        charactersCount = count;
      },
    });

    postMessage('Hello, World!');

    expect(charactersCount).toBe(0);
  });

  test('cannot post message if text is empty', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      charactersCount: 0,
    });

    expect(canSubmit).toBe(false);
  });

  test('can post message if text is inferior to max chars allowed', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 99,
    });

    expect(canSubmit).toBe(true);
  });

  test('cannot post message if text is superior to max chars allowed', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 101,
    });

    expect(canSubmit).toBe(false);
  });

  test('can post message if text is equal to max chars allowed', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 100,
    });

    expect(canSubmit).toBe(true);
  });

  test('can handle new text size on input changed', () => {
    let charactersCount = 0;
    const { handleTextChange } = createTestAddPostFormViewModel({
      setCharactersCount: (newCharactersCount: number) => {
        charactersCount = newCharactersCount;
      },
    });
    handleTextChange('Hello, World!');

    expect(charactersCount).toBe(13);
  });

  test('leading and trailing spaces should not count as characters', () => {
    let charactersCount = 0;
    const { handleTextChange } = createTestAddPostFormViewModel({
      setCharactersCount: (newCharactersCount: number) => {
        charactersCount = newCharactersCount;
      },
    });
    handleTextChange('   Hello, World!   ');

    expect(charactersCount).toBe(13);
  });

  test('should notify visually about maximum characters being reached when current count is over max', () => {
    const { inputBackgroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 101,
      });
    expect(inputBackgroundColor).toBe('red.300');
    expect(charCounterColor).toBe('red.300');
  });

  test('should not notify about maximum characters being reached when current count is under max', () => {
    const { inputBackgroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 99,
      });

    expect(inputBackgroundColor).toBe('white');
    expect(charCounterColor).toBe('muted');
  });

  test('should not notify about maximum characters being reached when current count is equal to max', () => {
    const { inputBackgroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 100,
      });
    expect(inputBackgroundColor).toBe('white');
    expect(charCounterColor).toBe('muted');
  });
});
