import messageOperations from '@/graphql/operations/message';
import { useMutation } from '@apollo/client';
import { Box, Input, border } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { sendMessageArgument } from '../../../../../../backend/src/util/types';
import { useSelector } from 'react-redux';
import { ObjectId } from 'bson';

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [messageBody, setMessageBody] = useState('');
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    sendMessageArgument
  >(messageOperations.Mutations.sendMessage);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /// send mutation

      console.log(userId)

      const messageId = new ObjectId().toString();
      const newMessage: sendMessageArgument = {
        id: messageId,
        senderId: userId,
        conversationId,
        body: messageBody,
      };

      const { data, errors } = await sendMessage({
        variables: { ...newMessage },
      });

      console.log(data);
      console.log(errors);

      if (!data?.sendMessage || errors)
        throw new Error('failed to send the message');
    } catch (error: any) {
      console.log('send failed:', error);
      toast.error(error?.message);
    }
  };
  return (
    <Box className='p-6 w-full'>
      <form onSubmit={onSubmitHandler}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          _focus={{
            borderColor: 'whiteAlpha.300',
            border: '1px solid',
            boxShadow: 'none',
          }}
          placeholder='Write your message'
        />
      </form>
    </Box>
  );
};

export default MessageInput;
