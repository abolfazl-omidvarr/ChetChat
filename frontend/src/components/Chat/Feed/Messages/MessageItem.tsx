import { Avatar, Box, Stack, Flex, Text } from '@chakra-ui/react';
import { MessagePopulated } from '../../../../../../backend/src/util/types';
import { formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Yesteryear } from 'next/font/google';

interface MessageItemProps {
  message: MessagePopulated;
  sentByCurrentUser: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eee 'at' p",
  yesterday: "'Yesteryear at' p",
  today: 'p',
  other: 'MM/dd/yy',
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  sentByCurrentUser,
}) => {
  return (
    <Stack
      direction='row'
      className={`
        p-4
        gap-4
      hover:bg-white/20
        justify-${sentByCurrentUser ? 'start' : 'end'}
    `}>
      {!sentByCurrentUser && (
        <Flex className='items-end'>
          <Avatar size='sm' />
        </Flex>
      )}
      <Stack className='gap-1 w-full'>
        <Stack
          direction='row'
          className={`
          items-center
          justify-${sentByCurrentUser ? 'end' : 'start'}
        `}>
          {!sentByCurrentUser && (
            <Text className='font-bold text-left'>
              {message.sender.username}
            </Text>
          )}
          <Text className='text-sm text-white/70'>
            {formatRelative(new Date(message.createdAt), new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Text>
        </Stack>
        <Flex
          className={`
          justify-${sentByCurrentUser ? 'end' : 'start'}
          `}>
          <Box
            className={`
              ${sentByCurrentUser ? 'bg-blue-600' : 'bg-white/20'}
              px-3
              py-2
              rounded-2xl
              max-w-[350px]
              
           `}>
            <Text>{message.body}</Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
