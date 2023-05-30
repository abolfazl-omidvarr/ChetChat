import { Box } from '@chakra-ui/react';
import {
  ConversationPopulated,
  ParticipantPopulated,
} from '../../../../../backend/src/util/types';
import ConversationItem from './conversationItem';
import { useSearchParams } from 'next/navigation';
import qs from 'querystring';
import { Fragment, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { conversationOperations } from '@/graphql/operations';
import { gql, useMutation } from '@apollo/client';

interface ConversationListProps {
  conversations: Array<ConversationPopulated> | undefined;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = useSelector((state: any) => state.auth.userId);

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(conversationOperations.Mutations.markConversationAsRead);

  const onConversationClickHandler = useCallback(
    async (
      conversationId: string,
      hasSeenLatestMessage: boolean | undefined
    ) => {
      const params = qs.parse(searchParams.toString());
      const newParams = { ...params, conversationId };
      router.push('?' + qs.stringify(newParams));

      //mark conversation as read if hasSeenLatestMessage is false
      if (hasSeenLatestMessage) return; //if already true not do anything

      try {
        await markConversationAsRead({
          variables: { conversationId, userId },
          optimisticResponse: { markConversationAsRead: true },
          update: (cache) => {
            // get conversation participant from cache
            const participantFragment = cache.readFragment<{
              participants: Array<ParticipantPopulated>;
            }>({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment Participants on Conversation {
                  participants {
                    user {
                      id
                      username
                    }
                    hasSeenLatestMassage
                  }
                }
              `,
            });
            if (!participantFragment) return;

            const participants = [...participantFragment.participants];
            const userParticipantIdx = participants.findIndex(
              (participant) => participant.user.id === userId
            );

            if (userParticipantIdx === -1) return;

            const userParticipant = participants[userParticipantIdx];

            //update participants to show latest message as read

            participants[userParticipantIdx] = {
              ...userParticipant,
              hasSeenLatestMassage: true,
            };

            //update cache

            cache.writeFragment({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment UpdatedParticipant on Conversation {
                  participants
                }
              `,
              data: {
                participants,
              },
            });
          },
        });
      } catch (error: any) {
        console.log('on view conversation error: mark as read');
      }
    },
    [searchParams]
  );

  return (
    <Box className='w-full'>
      {conversations?.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );
        return (
          <ConversationItem
            onClickConversation={() =>
              onConversationClickHandler(
                conversation.id,
                participant?.hasSeenLatestMassage!
              )
            }
            hasSeenLatestMassage={participant?.hasSeenLatestMassage}
            conversation={conversation}
            key={conversation.id}
            isSelected={
              qs.parse(searchParams.toString()).conversationId ===
              conversation.id
            }
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
