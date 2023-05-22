'use client';
import { Box, Button, IconButton, Stack, Text } from '@chakra-ui/react';
import ConversationList from './ConversationList';
import { useMutation, useQuery } from '@apollo/client';
import conversationOperations from '@/graphql/operations/conversation';
import {
  ConversationCreatedSubscriptionData,
  ConversationData,
  LogOutData,
} from '@/util/types';
import { MoonLoader } from 'react-spinners';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import useConversationModal from '@/Hooks/useConversationModal';
import { MdAddComment } from 'react-icons/md';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { useRouter, useSearchParams } from 'next/navigation';
import userOperations from '@/graphql/operations/user';

interface ConversationWrapperProps {}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({}) => {
  const params = useSearchParams();
  const { onOpen } = useConversationModal();
  const router = useRouter();

  const [logOut, { loading: logOutLoading }] = useMutation<LogOutData, {}>(
    userOperations.Mutations.logOut
  );

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
    <Box
      display={{
        base: params.get('conversationId') ? 'none' : 'flex',
        md: 'flex',
      }}
      className='w-full xl:w-[33vw] lg:w-[45vw] bg-white/5 py-3 px-3 flex flex-col relative'>
      <IconButton
        onClick={onOpen}
        position={'absolute'}
        borderRadius={'full'}
        className='p-9 bg-black/20 cursor-pointer bottom-4 right-4'
        aria-label='Create Conversation'
        icon={<MdAddComment size={22} />}
      />
      <Stack direction='row'>
        <IconButton
          onClick={async () => {
            await logOut();
            router.refresh();
          }}
          className='p-9 bg-black/20 cursor-pointer w-1/4'
          aria-label='LogOut'
          icon={<RiLogoutBoxLine size={25} />}
        />
        <IconButton
          className='p-9 bg-black/20 cursor-pointer w-1/4'
          aria-label='Profile'
          icon={<CgProfile size={25} />}
        />
        <Box className='w-2/4 h-full grid justify-center items-center font-bold'>
          User
        </Box>
      </Stack>

      <hr className='mt-2' />

      <Box className='h-[calc(100vh - 1rem)] overflow-y-auto'>
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
    </Box>
  );
};

export default ConversationWrapper;
