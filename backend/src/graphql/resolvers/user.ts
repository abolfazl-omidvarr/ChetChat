import { Prisma, User } from '@prisma/client';
import {
  GraphQLContext,
  createUsernameResponse,
  getCurrentUserResponse,
  loginUserResponse,
} from '../../util/types';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from '../../util/functions';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    searchUsers: async (
      _parent: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> => {
      const { username: searchedUsername } = args;
      const { prisma, res } = context;
      const {
        code,
        payload: { userId },
      } = res?.locals.tokenPayload;

      if (code !== 200) {
        throw new GraphQLError(
          'You are not authorized to perform this action.',
          {
            extensions: {
              code: code,
            },
          }
        );
      }

      try {
        const foundUsersByUsername = await prisma.user.findMany({
          where: {
            id: {
              not: userId,
            },
            username: {
              contains: searchedUsername,
              mode: 'insensitive',
            },
          },
        });
        const foundUsersByEmail = await prisma.user.findMany({
          where: {
            id: {
              not: userId,
            },
            email: {
              equals: searchedUsername,
              mode: 'insensitive',
            },
          },
        });

        const foundUser =
          foundUsersByUsername.length === 0
            ? foundUsersByEmail
            : foundUsersByUsername;

        console.log(foundUser);

        return foundUser;
      } catch (error) {
        throw new GraphQLError('something went wrong: ' + error);
      }
    },
    loginUser: async (
      _parent: any,
      args: { userMail: string; password: string },
      context: GraphQLContext
    ): Promise<loginUserResponse> => {
      const { userMail, password } = args;
      const { prisma, req, res, tokenPayload } = context;

      try {
        //search for user in database
        const existingUsername = await prisma.user.findUnique({
          where: {
            username: userMail,
          },
        });
        const existingEmail = await prisma.user.findUnique({
          where: {
            email: userMail,
          },
        });
        const existedUser = existingUsername || existingEmail;
        if (!existedUser) {
          return {
            error: 'Invalid Credentials',
          };
        }

        //compare found user's password with given password:
        //if no password is in database return error(in case of OAuth2 login type)
        if (!existedUser.hashedPassword) {
          return {
            error: 'Invalid Credentials',
          };
        }

        //password validation
        const isCorrectPassword = await bcrypt.compare(
          password,
          existedUser.hashedPassword
        );

        if (isCorrectPassword) {
          //send refresh token as httpOnly cookie
          sendRefreshToken(res!, createRefreshToken(existedUser));

          return {
            success: true,
            accessToken: createAccessToken(existedUser),
            userId: existedUser.id,
          };
        } else {
          return {
            error: 'Invalid Credentials',
          };
        }
      } catch (error: any) {
        return {
          error: 'login failed' + error,
        };
      }
    },
    getCurrentUser: async (
      _parent: any,
      _args: any,
      context: GraphQLContext
    ): Promise<getCurrentUserResponse | null> => {
      const { prisma, res } = context;
      const status = res?.locals.tokenPayload.code;
      const payload = res?.locals.tokenPayload.payload;

      try {
        if (status !== 200) {
          throw new GraphQLError('UNAUTHENTICATED');
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });
        if (!user) {
          throw new GraphQLError('Error in getting user info');
        }

        return {
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.image,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Mutation: {
    createUsername: async (
      _parent: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<createUsernameResponse> => {
      const { username } = args;
      const { prisma, req, res, tokenPayload } = context;
      const code = tokenPayload?.code;
      const userId = tokenPayload?.payload?.userId;

      if (code !== 200) {
        throw new GraphQLError('access token Expired');
      }

      try {
        //check uniqueness of username in database
        const existingUSer = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUSer) {
          return {
            error: 'This username is already taken',
          };
        }

        //update user
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log('create username failed: ', error);
        throw new GraphQLError('create username failed:' + error);
      }
    },
    createUser: async (
      _parent: any,
      args: { username: string; password: string; email: string },
      context: GraphQLContext
    ): Promise<createUsernameResponse> => {
      const { username, password, email } = args;
      const { prisma } = context;

      const hashedPassword = await bcrypt.hash(password, 12);

      try {
        //check uniqueness of username in database
        const existingUsername = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        const existingEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (existingUsername) {
          return {
            error: 'This username is already taken',
          };
        }
        if (existingEmail) {
          return {
            error: 'This email is already taken',
          };
        }
        //update user

        await prisma.user.create({
          data: {
            email,
            username,
            hashedPassword,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log(error);
        return {
          error: 'Account creation failed, maybe try different inputs',
        };
      }
    },
    revokeRefreshToken: async (
      _parent: any,
      args: { userId: string },
      context: GraphQLContext
    ) => {
      const { userId } = args;
      const { prisma, req, res, tokenPayload } = context;
      await prisma.user.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      });
    },
    logOut: async (_parent: any, _args: any, context: GraphQLContext) => {
      const { req, res } = context;
      sendRefreshToken(res!, '');
    },
  },
  // Subscription: {},
};

export default resolvers;
