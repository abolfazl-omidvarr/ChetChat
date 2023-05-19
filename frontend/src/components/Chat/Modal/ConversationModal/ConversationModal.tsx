'use client';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import useConversationModal from '@/Hooks/useConversationModal';
import userOperations from '@/graphql/operations/user';

import {
  CreateConversationData,
  CreateConversationInput,
  SearchUserData,
  SearchUserInput,
} from '@/util/types';
import { toast } from 'react-hot-toast';
import conversationOperations from '@/graphql/operations/conversation';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Button,
  ModalFooter,
  Input,
} from '@chakra-ui/react';
import { RiUserSearchLine } from 'react-icons/ri';
import UserSearchList from './UserSearchList';
import { Session } from 'next-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useSelector } from 'react-redux';

interface ConversationModalProps {
  at: string;
}
const ConversationModal: React.FC<ConversationModalProps> = ({ at }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const myId = useSelector((state: any) => state.auth.userId);

  const { isOpen, onClose, participants, addParticipant, removeParticipant } =
    useConversationModal();


  //search for user graphQL query
  const [searchUsers, { data: queryData, loading: queryLoading }] =
    useLazyQuery<SearchUserData, SearchUserInput>(
      userOperations.Queries.searchUsers
    );

  //create a conversation graphQL mutation
  const [createConversation, { loading: mutationLoading }] = useMutation<
    CreateConversationData,
    CreateConversationInput
  >(conversationOperations.Mutations.createConversation);


  const onSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let data;
    let error;
    try {
      //initial request to apollo server
      const apolloResponse = await searchUsers({ variables: { username } });
      error = apolloResponse.error;

      //second request to apollo server if access token was expired
      if (error) {
        const apolloRefetchResponse = await apolloResponse.refetch();
        error = apolloRefetchResponse.error;
        if (error) throw new Error('failed to fetch users info');
      }

      console.log(queryData);
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  const onCreateFunction = useCallback(async () => {
    const participantIds = [...participants.map((elem) => elem.id), myId];
    try {
      const { data } = await createConversation({
        variables: { participantIds },
      });

      if (!data?.createConversation)
        throw new Error('failed to create conversation, please try Again');

      const {
        createConversation: { conversationId },
      } = data;

      const url = qs.stringifyUrl({
        url: '/',
        query: { conversationId },
      });
      router.push(url);
    } catch (error: any) {
      toast.error('An error accrued: ' + error.message);
      console.log(error);
    }
  }, [participants]);


  return (
    <>
      <Modal
        motionPreset='slideInBottom'
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent
          bg='#2d2d2d'
          pb={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearchSubmit}>
              <Stack spacing={4}>
                <Input
                  placeholder='Enter username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  leftIcon={<RiUserSearchLine size={25} />}
                  type='submit'
                  isDisabled={!username || queryLoading}
                  isLoading={queryLoading}>
                  Search
                </Button>
              </Stack>
            </form>
            <UserSearchList
              empty={!queryData}
              users={queryData?.searchUsers}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onCreateFunction}
              isDisabled={participants.length === 0 || mutationLoading}
              isLoading={mutationLoading}
              className='w-full'
              bg={'brand.100'}
              boxShadow={'base'}
              _hover={{
                bg: 'brand.100',
                boxShadow: 'lg',
              }}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
