import { useQuery } from '@apollo/client';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { ConversationData } from '@/util/types';
import { conversationOperations } from '@/graphql/operations';
// import ConversationOperations from '../../../../graphql/operations/conversations';
// import { formatUsernames } from '../../../../util/functions';
// import SkeletonLoader from '../../../common/SkeletonLoader';

interface MessagesHeaderProps {
  userId: string;
  conversationId: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  userId,
  conversationId,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConversationData>(
    conversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  if (data?.conversations && !loading && !conversation) {
    router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  }

  const usernames = conversation?.participants
    .map((p) => p.user.username)
    .join(', ');

  return (
    <Stack
      direction='row'
      className='py-5 w-full border-b border-white/200 px-4 md:px-0 gap-6 items-center '>
      <Button
        display={{ md: 'none' }}
        onClick={() =>
          router.replace('?conversationId', '/', {
            shallow: true,
          })
        }>
        Back
      </Button>
      {/* {loading && (
        <SkeletonLoader
          count={1}
          height='30px'
          width='320px'
        />
      )} */}
      {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Stack
          width='100%'
          direction='row'>
          <Text color='whiteAlpha.600'>To: </Text>
          <Text fontWeight={600}>{usernames}</Text>
        </Stack>
      )}
    </Stack>
  );
};
export default MessagesHeader;
