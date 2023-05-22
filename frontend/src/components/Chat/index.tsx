'use client';
import { Button, Flex } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import ConversationWrapper from './Conversation/ConversationWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';
import useAuthenticated from '@/Hooks/useAuthenticated';
import { useRouter } from 'next/navigation';
import { useLazyQuery, useMutation } from '@apollo/client';

import testOperations from '@/graphql/operations/test';
import { LogOutData, testData, testInput } from '@/util/types';

import { store } from '@/redux/Store';
import authSlice from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import userOperations from '@/graphql/operations/user';

interface ChatProps {
  at: string;
}

const Chat: React.FC<ChatProps> = ({ at }) => {
  const [test, { data, loading, error }] = useLazyQuery<testData, testInput>(
    testOperations.Queries.test,
    { fetchPolicy: 'no-cache' }
  );

  const router = useRouter();
  return (
    <Flex className='h-screen'>
      <ConversationWrapper />
      <FeedWrapper />
    </Flex>
  );
};

export default Chat;
