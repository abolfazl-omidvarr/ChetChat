'use client';
import React from 'react';
import { Box, Button, Center, Input, Stack, Text } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { useMutation } from '@apollo/client';
import { Session } from 'next-auth';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import userOperations from '@/graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariable } from '@/util/types';
import { useRouter } from 'next/navigation';

type UserNameCreateProps = {
  // username: string;
  // setUsername: (e: string) => void;
  // onSubmit: () => void;
  // isLoading: boolean;
};

const UserNameCreate: React.FC<UserNameCreateProps> = ({}) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [createUsername, { loading }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariable
  >(userOperations.Mutations.createUsername);

  const onSubmit = useCallback(async () => {
    if (!username) return;
    try {
      const { data } = await createUsername({ variables: { username } });
      console.log(data);
      if (!data?.createUsername) {
        throw new Error('something went wrong');
      }
      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success('Username successfully set! 🔥');
    } catch (error: any) {
      toast.error('username set failed: ' + error?.message);
      console.log('username set failed', error);
    }
  }, [username]);

  return (
    <>
      <Text className='text-3xl'>Create a Username</Text>
      <Input
        placeholder='Enter the username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className='flex flex-row gap-2 w-full'>
        <Button
          isLoading={loading}
          className='w-1/2'
          onClick={onSubmit}>
          Save
        </Button>
        <Button
          isDisabled={loading}
          className='w-1/2'
          onClick={() => signOut()}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default UserNameCreate;
