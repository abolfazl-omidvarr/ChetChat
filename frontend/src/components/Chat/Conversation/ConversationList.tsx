import { Box } from '@chakra-ui/react';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import ConversationItem from './conversationItem';
import { useSearchParams } from 'next/navigation';
import qs from 'querystring';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ConversationListProps {
  conversations: Array<ConversationPopulated> | undefined;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onConversationClickHandler = useCallback(
    (conversationId: string) => {
      const params = qs.parse(searchParams.toString());
      const newParams = { ...params, conversationId };
      router.push('?' + qs.stringify(newParams));
    },
    [searchParams]
  );

  return (
    <Box className='w-full'>
      {conversations?.map((conversation) => (
        <ConversationItem
          onClickConversation={() => onConversationClickHandler(conversation.id)}
          conversation={conversation}
          key={conversation.id}
          isSelected={
            qs.parse(searchParams.toString()).conversationId === conversation.id
          }
        />
      ))}
    </Box>
  );
};

export default ConversationList;
