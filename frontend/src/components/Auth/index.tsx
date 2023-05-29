'use client';
import { useState } from 'react';
import { Center, Stack } from '@chakra-ui/react';
import { Session } from 'next-auth';
import UserNameCreate from './UserNameCreate';
import AccountCreate from './AccountCreate';
import LogIn from './LogIn';
import { useDispatch, useSelector } from 'react-redux';

interface AuthProps {
  reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ reloadSession }) => {
  const [logIn, setLogIn] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const username = useSelector((state: any) => state.auth.username);

  const authComponent = !token ? (
    logIn ? (
      <LogIn
        login={logIn}
        setLogin={setLogIn}
        reloadSession={reloadSession}
      />
    ) : (
      <AccountCreate
        login={logIn}
        setLogin={setLogIn}
      />
    )
  ) : (
    !username && <UserNameCreate />
  );

  // const authComponent =
  // 	token && !username ? (
  // 		logIn ? (
  // 			<LogIn
  // 				login={logIn}
  // 				setLogin={setLogIn}
  // 				reloadSession={reloadSession}
  // 			/>
  // 		) : (
  // 			<AccountCreate login={logIn} setLogin={setLogIn} />
  // 		)
  // 	) : (
  // 		<UserNameCreate />
  // 	);

  return (
    <Center className='h-screen'>
      <Stack className='items-center'>{authComponent}</Stack>
    </Center>
  );
};

export default Auth;
