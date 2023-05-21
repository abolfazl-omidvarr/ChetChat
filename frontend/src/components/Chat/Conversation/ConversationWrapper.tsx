'use client';
import { Box } from '@chakra-ui/react';
import ConversationList from './ConversationList';
import { useQuery } from '@apollo/client';
import conversationOperations from '@/graphql/operations/conversation';
import {
  ConversationCreatedSubscriptionData,
  ConversationData,
} from '@/util/types';
import { MoonLoader } from 'react-spinners';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface ConversationWrapperProps {
  at: string;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({ at }) => {
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationData>(conversationOperations.Queries.conversations, {
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;

        const isExisted = [...prev.conversations].some(
          (conver) => conver.id === newConversation.id
        );

        return Object.assign({}, prev, {
          conversations: isExisted
            ? [...prev.conversations]
            : [newConversation, ...prev.conversations],
        });
      },
    });
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box className='w-full md:w-[400px] bg-white/5 py-6 px-3 flex flex-col'>
      {conversationsLoading ? (
        <div className='w-full h-full grid justify-center items-center'>
          <MoonLoader
            size={50}
            color='#becbc8'
          />
        </div>
      ) : (
        <ConversationList conversations={conversationsData?.conversations} />
      )}
    </Box>
  );
};

export default ConversationWrapper;
