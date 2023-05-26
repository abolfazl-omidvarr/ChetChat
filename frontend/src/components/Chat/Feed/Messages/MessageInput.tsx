import { Box, Input, border } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [messageBody, setMessageBody] = useState('');
  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /// send mutation
    } catch (error: any) {
      console.log('send failed:', error);
      toast.error(error?.message);
    }
  };
  return (
    <Box className='p-6 w-full'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('submitted');
        }}>
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
