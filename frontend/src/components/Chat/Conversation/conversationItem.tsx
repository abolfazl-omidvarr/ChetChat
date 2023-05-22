'use client';
import { Box, Stack, Text, Avatar, Flex } from '@chakra-ui/react';
import ConversationList from './ConversationList';
import { useQuery } from '@apollo/client';
import conversationOperations from '@/graphql/operations/conversation';
import { ConversationData } from '@/util/types';
import { MoonLoader } from 'react-spinners';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'querystring';

interface ConversationItemProps {
  conversation: ConversationPopulated;
  onClickConversation: () => void;
  isSelected: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  onClickConversation,
  conversation,
  isSelected,
}) => {
  const searchParams = useSearchParams();
  const params = qs.parse(searchParams.toString());

  const conversationName =
    conversation?.name ||
    conversation?.participants
      .map((p) => p.user.username)
      .splice(0, 2)
      .join(', ');

  const conversationLatestMessage =
    conversation?.latestMessage?.body || 'No messages yet';

  const updateDate = formatDistanceToNowStrict(
    new Date(conversation.updatedAt)
  );

  return (
    <Stack
      onClick={onClickConversation}
      direction='row'
      className={`p-3 my-2 cursor-pointer hover:bg-white/20 rounded-md w-full ${
        isSelected && 'bg-white/20'
      }`}>
      <Avatar size='md' />
      <Box width='full'>
        <Flex className='items-center justify-between whitespace-nowrap w-full'>
          <Text className='font-semibold  xl:w-[12vw] lg:w-[16vw] w-[18vw] overflow-hidden text-ellipsis'>
            {conversationName}
          </Text>
          <Text className='text-[0.75rem] text-neutral-500 whitespace-nowrap'>
            {updateDate}
          </Text>
        </Flex>

        <Text className='text-neutral-400 text-sm'>
          {conversationLatestMessage}
        </Text>
      </Box>
    </Stack>
  );
};

export default ConversationItem;
