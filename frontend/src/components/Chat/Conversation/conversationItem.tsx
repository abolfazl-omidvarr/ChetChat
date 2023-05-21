'use client';
import { Box, Stack, Text, Avatar, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import { useQuery } from '@apollo/client';
import conversationOperations from '@/graphql/operations/conversation';
import { ConversationData } from '@/util/types';
import { MoonLoader } from 'react-spinners';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';


interface ConversationItemProps {
  conversation: ConversationPopulated;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onClick,
}) => {
  const router = useRouter();

  const conversationName =
    conversation?.name ||
    conversation?.participants
      .map((p) => p.user.username)
      .splice(0, 2)
      .join(', ');

  const conversationLatestMessage =
    conversation?.latestMessage?.body || 'No messages yet';
  const updateDate = format(new Date(conversation.updatedAt), 'yy/M/d');
  return (
    <Stack
      onClick={onClick}
      direction='row'
      className={`p-4 hover:bg-white/20 rounded-md`}>
      <Avatar size='md' />
      <Box width='full'>
        <Flex className='items-center justify-between'>
          <Text className='font-semibold w-full overflow-hidden'>
            {conversationName}
          </Text>
          <Text className='text-[0.7rem] text-neutral-400'> {updateDate}</Text>
        </Flex>

        <Text className='text-neutral-400 text-sm'>
          {conversationLatestMessage}
        </Text>
      </Box>
    </Stack>
  );
};

export default ConversationItem;
