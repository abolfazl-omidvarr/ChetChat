'use client';
import { Box, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import { useQuery } from '@apollo/client';
import conversationOperations from '@/graphql/operations/conversation';
import { ConversationData } from '@/util/types';
import { MoonLoader } from 'react-spinners';
import { ConversationPopulated } from '../../../../../backend/src/util/types';

interface ConversationItemProps {
  conversation: ConversationPopulated | undefined;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
}) => {
  return (
    <Stack className='p-4 hover:bg-white/20 rounded-md'>
      <Text>{conversation?.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
