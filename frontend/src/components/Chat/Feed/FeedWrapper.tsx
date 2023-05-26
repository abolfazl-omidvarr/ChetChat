'use client';
import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useParams, useSearchParams } from 'next/navigation';
import qs from 'query-string';

import MessagesHeader from './Messages/Header';
import { useSelector } from 'react-redux';
import MessageInput from './Messages/MessageInput';
import Messages from './Messages/Messages';

interface FeedWrapperProps {}

const FeedWrapper: React.FC<FeedWrapperProps> = ({}) => {
  const params = useSearchParams();
  const conversationId = params.get('conversationId');
  const userId = useSelector((state: any) => state.auth.userId);
  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      className={`w-full flex-col`}>
      {conversationId && typeof conversationId === 'string' ? (
        <>
          <Flex className='overflow-hidden justify-between flex-grow flex-col'>
            <MessagesHeader
              userId={userId}
              conversationId={conversationId}
            />
            <Messages
              conversationId={conversationId}
              userId={userId}
            />
          </Flex>
          <MessageInput conversationId={conversationId} />
        </>
      ) : (
        <div>No conversation selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
