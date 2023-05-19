'use client';
import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useParams, useSearchParams } from 'next/navigation';
import qs from 'query-string';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const params = useSearchParams();
  const conversationId = params.get('conversationId');
  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      className={`w-full flex-col`}>
      {conversationId ? <Flex></Flex> : <div>No conversation selected</div>}
    </Flex>
  );
};

export default FeedWrapper;
