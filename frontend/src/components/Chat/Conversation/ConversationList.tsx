import { Session } from 'next-auth';
import { Box, Text } from '@chakra-ui/react';
import ConversationModal from '../Modal/ConversationModal/ConversationModal';
import useConversationModal from '@/Hooks/useConversationModal';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import { ConversationData } from '@/util/types';
import ConversationItem from './conversationItem';
import { useSearchParams } from 'next/navigation';
import qs from 'querystring';
import { useCallback } from 'react';

interface ConversationListProps {
  conversations: Array<ConversationPopulated> | undefined;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
}) => {
  const params = useSearchParams();

  const onConversationClickHandler = useCallback(() => {
    const paramss = params;
    console.log(qs.parse(paramss.toString()));
  }, [params]);

  const { onOpen } = useConversationModal();
  return (
    <Box className='w-full'>
      <Box
        onClick={onOpen}
        className='py-2 px-5 mb-4 bg-black/20 rounded-md cursor-pointer'>
        <Text className='font-semibold text-center'>
          Find or Start a Conversation
        </Text>
      </Box>
      {conversations?.map((conversation) => (
        <ConversationItem
          onClick={onConversationClickHandler}
          conversation={conversation}
          key={conversation.id}
        />
      ))}
    </Box>
  );
};

export default ConversationList;
