'use client';
import { Box, Stack, Text, Avatar, Flex } from '@chakra-ui/react';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { FaDotCircle } from 'react-icons/fa';

interface ConversationItemProps {
  conversation: ConversationPopulated;
  onClickConversation: () => void;
  isSelected: boolean;
  hasSeenLatestMassage: boolean | undefined;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  onClickConversation,
  conversation,
  isSelected,
  hasSeenLatestMassage,
}) => {
  console.log(hasSeenLatestMassage);
  const searchParams = useSearchParams();
  const conversationName =
    conversation?.name ||
    conversation?.participants.map((p) => p.user.username).join(', ');

  const conversationLatestMessage =
    conversation?.latestMessage?.body || 'No messages yet';

  const updateDate = formatDistanceToNowStrict(
    new Date(conversation.updatedAt)
  );

  return (
    <Stack
      onClick={onClickConversation}
      direction='row'
      className={`p-3 my-2 cursor-pointer hover:bg-white/20 rounded-md w-full relative ${
        isSelected && 'bg-white/20'
      }
      items-center
      `}>
      {!hasSeenLatestMassage && (
        <Box className='absolute top-1 left-1'>
          <FaDotCircle color='#00ff00aa' />
        </Box>
      )}
      <Avatar size='md' />
      <Box width='full'>
        <Flex className='items-center justify-between whitespace-nowrap w-full'>
          <Text className='font-semibold  xl:w-[12vw] md:w-[16vw] w-[65vw] overflow-hidden text-ellipsis'>
            {conversationName}
          </Text>
          <Text className='text-[0.75rem] text-neutral-500 whitespace-nowrap'>
            {updateDate}
          </Text>
        </Flex>

        <Text className='text-neutral-400 text-sm whitespace-nowrap xl:w-[12vw] md:w-[16vw] w-[70vw] overflow-hidden text-ellipsis'>
          {conversationLatestMessage}
        </Text>
      </Box>
    </Stack>
  );
};

export default ConversationItem;
