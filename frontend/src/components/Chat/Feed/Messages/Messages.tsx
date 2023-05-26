import { Flex, Stack } from '@chakra-ui/react';
import { MessagesData, MessagesVariables } from '@/util/types';
import messageOperations from '@/graphql/operations/message';
import { useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';

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

  console.log(data);

  return (
    <Flex className='flex-col justify-end overflow-hidden'>
      {loading && (
        <Stack>
          <span>LOADING MESSAGES</span>
        </Stack>
      )}
      {data?.messages && (
        <Flex className='flex-col-reverse overflow-auto h-full'>
          {data.messages.map((msg) => (
            <div>{msg.body}</div>
            // <MessageItem />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
