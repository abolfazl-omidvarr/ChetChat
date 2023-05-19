// "use client";
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Box } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { FcGoogle, FcSalesPerformance } from 'react-icons/fc';
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CreateUserVariable, CreateUserData } from '@/util/types';
import userOperations from '@/graphql/operations/user';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import getGoogleOAuthURL from '@/util/getGoogleUrl';

interface AccountCreateProps {
  login: boolean;
  setLogin: (state: boolean) => void;
}
interface FormErrorProps {
  criteria: boolean;
  text: string;
}

const FormError: React.FC<FormErrorProps> = ({ criteria, text }) => (
  <p
    style={{ margin: 0 }}
    className={`text-left w-full text-red-500 text-xs overflow-hidden transition-[height] duration-200 
		${criteria ? 'h-4' : 'h-0'}`}>
    {text}
  </p>
);

const AccountCreate: React.FC<AccountCreateProps> = ({ login, setLogin }) => {

  const router = useRouter();
  const [createUser, { loading, data, error }] = useMutation<
    CreateUserData,
    CreateUserVariable
  >(userOperations.Mutations.createUser);
  //handle form for create account
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { username: '', email: '', password: '' },
  });

  const onCreateAccountSubmit: SubmitHandler<FieldValues> = useCallback(
    async (inputs) => {
      const { username, password, email } = inputs;
      const { data } = await createUser({
        variables: {
          username,
          password,
          email,
        },
      });

      if (!data?.createUser) {
        return toast.error('Oops, something is not quite alright');
      }
      if (data?.createUser.error) {
        return toast.error(data?.createUser?.error);
      }
      if (data?.createUser.success) {
        setLogin(true);
        toast.success('Account successfully created  🚀\nNow you may log in');
      }
    },
    []
  );

  const inputClass = (id: string) => `
	peer
	w-full
	p-2
	font-light
	bg-black/30
	border-2
	rounded-md
	outline-none
	transition
	disabled:opacity-70
	disabled:cursor-not-allowed
	${
    errors[id]
      ? 'border-rose-500 focus:border-rose-500'
      : 'border-neutral-600 focus:border-neutral-400'
  }
`;

  return (
    <>
      <Text className='text-3xl'>ChetChat Messenger</Text>
      <Text className='text-xl'>Create an account</Text>
      <input
        type='email'
        id='email'
        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
        placeholder='Email'
        className={inputClass('email')}
      />
      <FormError
        criteria={!!errors.email}
        text='Email is required and must be a valid address.'
      />
      <input
        id='username'
        {...register('username', { required: true })}
        placeholder='Username'
        className={inputClass('username')}
      />
      <FormError
        criteria={!!errors.username}
        text='Username is required.'
      />

      <input
        type='password'
        id='password'
        {...register('password', {
          required: true,
          pattern: /^(?=.*[A-Za-z])[A-Za-z\d]{6,}$/,
        })}
        placeholder='Password'
        className={inputClass('password')}
      />
      <FormError
        criteria={!!errors.password}
        text='Password must contain at least 6 characters and one letter.'
      />
      <Button
        isLoading={loading}
        isDisabled={loading}
        width={'full'}
        onClick={() => handleSubmit(onCreateAccountSubmit)()}>
        Create
      </Button>
      <Text className='text-4xl py-2'>OR</Text>
      <Button
        isDisabled={loading}
        onClick={() => {
          // getGoogleOAuthURL();
          window.location.replace(getGoogleOAuthURL());
          // getGoogleOAuthURL()
          // signIn("google");
        }}
        leftIcon={<FcGoogle size={25} />}>
        Continue with Google
      </Button>
      <Text className='text-sm py-2'>
        Already have an account?
        <span
          onClick={() => {
            if (loading) return;
            setLogin(true);
          }}
          className='hover:underline ml-1 cursor-pointer'>
          Log in
        </span>
      </Text>
    </>
  );
};

export default AccountCreate;
