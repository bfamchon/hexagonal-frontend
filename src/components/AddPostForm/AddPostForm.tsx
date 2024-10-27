import { createAddPostFormViewModel } from '@/components/AddPostForm/add-post-form.viewmodel';
import { AppDispatch } from '@/lib/create-store';
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Stack,
  Text,
  Textarea,
  TextProps,
} from '@chakra-ui/react';
import { nanoid } from '@reduxjs/toolkit';
import { FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface AddPostFormElements extends HTMLFormControlsCollection {
  text: HTMLTextAreaElement;
}

interface IAddPostForm extends HTMLFormElement {
  readonly elements: AddPostFormElements;
}

export const AddPostForm = ({
  placeholder,
  timelineId,
}: {
  placeholder: string;
  timelineId: string;
}) => {
  const [charactersCount, setCharactersCount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    postMessage,
    canSubmit,
    handleTextChange,
    charCounterColor,
    inputBackgroundColor,
  } = createAddPostFormViewModel({
    dispatch,
    messageId: nanoid(5),
    timelineId,
    maxCharacters: 280,
    charactersCount,
    setCharactersCount,
  });
  const handleSubmit = (event: FormEvent<IAddPostForm>) => {
    event.preventDefault();

    const text = event.currentTarget.elements.text.value;
    postMessage(text);

    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing="4">
        <Link to={`/`}>
          <Avatar src="https://picsum.photos/200?random=pierre" boxSize="12" />
        </Link>
        <FormControl id="text">
          <Textarea
            ref={textareaRef}
            rows={3}
            resize="none"
            placeholder={placeholder}
            backgroundColor={inputBackgroundColor}
            name="text"
            required
            onChange={(event) => handleTextChange(event.target.value)}
          />
        </FormControl>
      </Stack>
      <Flex direction="row-reverse" py="4" px={{ base: '4', md: '6' }}>
        <Button
          colorScheme="twitter"
          type="submit"
          variant="solid"
          isDisabled={!canSubmit}
        >
          Post message
        </Button>
        <MaxCharCounter
          remaining={280 - charactersCount}
          color={charCounterColor}
          alignSelf={'center'}
          marginRight={5}
        />
      </Flex>
    </form>
  );
};

const MaxCharCounter = ({
  remaining,
  ...textProps
}: { remaining: number } & TextProps) => {
  return <Text {...textProps}>{remaining} characters remaining</Text>;
};
