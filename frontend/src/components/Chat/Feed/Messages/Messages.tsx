import { Flex, Stack } from '@chakra-ui/react';
import {
  MessageSubscriptionData,
  MessagesData,
  MessagesVariables,
} from '@/util/types';
import messageOperations from '@/graphql/operations/message';
import { useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '@/components/Common/Skeleton';
import { useEffect } from 'react';

interface MessagesProps {
  userId: string;
  conversationId: string;
}
const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(messageOperations.Queries.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: messageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId]);

  // useEffect(() => {
  //   if (!messagesEndRef.current || !data) return;
  //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  // }, [data, messagesEndRef.current]);

  if (error) return null;

  return (
    <Flex className='flex-col justify-end overflow-hidden'>
      {loading && (
        <Stack className='gap-3 px-4'>
          <SkeletonLoader
            count={5}
            width='full'
            height='50px'
            mb='0'
          />
        </Stack>
      )}
      {data?.messages && (
        <Flex className='flex-col-reverse overflow-auto h-full'>
          {data.messages.map((msg) => (
            <div key={msg.body}>{msg.body}</div>
            // <MessageItem />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
