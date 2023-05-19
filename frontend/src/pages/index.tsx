'use client';
import { Inter } from 'next/font/google';
import { NextPage } from 'next';
import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { Chat, Auth } from '@/components';
import { useCallback, useEffect, useState } from 'react';
import ConversationModal from '@/components/Chat/Modal/ConversationModal/ConversationModal';
import { getAccessToken, setAccessToken } from '@/libs/AccessToken';

import { store } from '@/redux/Store';
import authSlice from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { useLazyQuery } from '@apollo/client';
import userOperations from '@/graphql/operations/user';
import { getCurrentUserData } from '@/util/types';
import { toast } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [getCurrentUser, { data: getUserData, error: getUserError }] =
    useLazyQuery<getCurrentUserData, {}>(userOperations.Queries.getCurrentUser);

  const dispatch = useDispatch();
  const savedUserId = useSelector((state: any) => state.auth.userId);
  const token = useSelector((state: any) => state.auth.token);
  const username = useSelector((state: any) => state.auth.username);

  const dispatchTokenAndId = (id: string | null, token: string | null) =>
    dispatch(
      authSlice.actions.setTokenAndId({
        userId: id,
        accessToken: token,
      })
    );
  const dispatchUserInfo = (
    name: string | null,
    image: string | null,
    email: string,
    username: string | null
  ) =>
    dispatch(authSlice.actions.setUserInfo({ username, email, image, name }));

  console.log(savedUserId);

  //useEffect to get accessToken
  useEffect(() => {
    fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async (data) => {
      const { accessToken, userId } = await data.json();
      if (accessToken) {
        dispatchTokenAndId(userId, accessToken);
      } else {
        dispatchTokenAndId(null, null);
        setLoading(false);
      }
    });
  }, []);

  //useEffect to get current user data
  useEffect(() => {
    if (!savedUserId) return;

    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (getUserError) {
          throw new Error('failed to fetch user info ');
        } else {
          //@ts-ignore
          const { name, image, email, username } = data?.data?.getCurrentUser;
          dispatchUserInfo(name, image, email, username);
        }
      } catch (error: any) {
        console.log(error);
        toast.error('faild to fetch user info: ', error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [savedUserId]);

  const reloadSession = useCallback(() => router.refresh(), [router]);

  const Loading = (
    <div className='w-screen h-screen grid justify-center items-center'>
      <BeatLoader
        color='#9badbc'
        loading
      />
    </div>
  );

  return loading ? (
    Loading
  ) : (
    <>
      <Box>
        {token && username ? (
          <Chat at={getAccessToken()} />
        ) : (
          <Auth
            at={getAccessToken()}
            reloadSession={reloadSession}
          />
        )}
      </Box>
      <ConversationModal at={getAccessToken()} />
    </>
  );
};

export default Home;
