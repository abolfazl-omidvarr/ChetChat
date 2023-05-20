import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { createServer } from 'http';
import { PubSub } from 'graphql-subscriptions';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

import express from 'express';

import * as dotenv from 'dotenv';

import Jwt from 'jsonwebtoken';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import {
  GraphQLContext,
  SubscriptionContext,
  TokenPayload,
} from './util/types';
import { PrismaClient, User } from '@prisma/client';
import prisma from './prisma/prisma';
import { isAuthMiddleWare, isAuthSubscription } from './middleWare/isAuth';
import cookieParser from 'cookie-parser';
import qs from 'querystring';
import { googleUser } from './util/types';
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from './util/functions';

const main = async () => {
  const pubSub = new PubSub();
  const app = express();
  const httpServer = createServer(app);
  dotenv.config();

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const corsOption = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql/subscriptions',
  });

  const getSubscriptionContext = async (
    ctx: SubscriptionContext
  ): Promise<GraphQLContext> => {
    ctx;
    // ctx is the graphql-ws Context where connectionParams live
    if (ctx.connectionParams && ctx.connectionParams.accessToken) {
      const { accessToken } = ctx.connectionParams;
      const tokenPayload = isAuthSubscription(accessToken);
      return {
        prisma,
        pubSub,
        tokenPayload,
        req: null,
        res: null,
        //@ts-ignore
        kosher: 'hello',
      };
    }

    // Otherwise let our resolvers know we don't have a current user
    return {
      prisma,
      pubSub,
      tokenPayload: null,
      req: null,
      res: null,
      //@ts-ignore
      kosher: 'hello',
    };
  };

  const serverCleanup = useServer(
    {
      schema,
      context: (ctx: SubscriptionContext) => {
        // This will be run every time the client sends a subscription request
        // Returning an object will add that information to our
        // GraphQL context, which all of the resolvers have access to.
        return getSubscriptionContext(ctx);
      },
    },
    wsServer
  );
  const server = new ApolloServer({
    schema,
    introspection: true,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use('/', cookieParser());

  app.use(
    '/graphql',
    cookieParser(),
    cors<cors.CorsRequest>(corsOption),
    bodyParser.json(),
    isAuthMiddleWare,
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {
        const { tokenPayload } = res.locals;
        return { req, res, prisma, tokenPayload, pubSub };
      },
    })
  );
  app.use('/refresh_token', cors<cors.CorsRequest>(corsOption));
  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    try {
      const payload: any = Jwt.verify(token, process.env.REFRESH_SECRET!);
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (!user) {
        return res.send({ ok: false, accessToken: '' });
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: '' });
      }

      sendRefreshToken(res, createRefreshToken(user));

      return res.send({
        ok: true,
        accessToken: createAccessToken(user),
        userId: payload.userId,
      });
    } catch (error) {
      console.log(error);
    }
  });

  app.use('/google-oAuth', cors<cors.CorsRequest>(corsOption));
  app.get('/google-oAuth', async (req, res) => {
    try {
      //get the code from queryString
      const code = req.query.code as string;
      //get the id and access token with code
      const { id_token, access_token } = await getGoogleOAuthTokens({ code });
      //get user with token
      const googleUser = Jwt.decode(id_token) as googleUser;
      const foundUser = await findAccount(googleUser);
      if (foundUser) {
        sendRefreshToken(res, createRefreshToken(foundUser));
        res.redirect('http://localhost:3000');
      }

      if (!foundUser) {
        const createdUser = await createAccount(googleUser);
        sendRefreshToken(res, createRefreshToken(createdUser));
        res.redirect('http://localhost:3000');
      }

      //if not found
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
      res.redirect('http://localhost:3000');
    }
  });

  const getGoogleOAuthTokens = async ({ code }: { code: string }) => {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
      grant_type: 'authorization_code',
    };

    try {
      // const res = await axios.post(url, values, {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      // });
      //@ts-ignore
      const googleUser = await fetch(url, {
        method: 'POST',
        body: qs.stringify(values),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(async (res: any) => await res.json());

      return googleUser;
    } catch (error: any) {
      console.error(error);
      console.log('failed to fetch google oath tokens:' + error.message);
      throw new Error(error.message);
    }
  };

  const findAccount = async (googleUser: googleUser) => {
    const foundUser = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });
    return foundUser;
  };
  // const updateAccount = async (user: any) => {};
  const createAccount = async (googleUser: googleUser) => {
    const { picture, email, email_verified, name, given_name } = googleUser;
    const createdUser = await prisma.user.create({
      data: {
        email,
        emailVerified: email_verified,
        image: picture,
        name: name,
        username: `${given_name}${makeId(5)}`,
      },
    });
    return createdUser;
  };

  function makeId(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  httpServer.listen(4000, () => {
    console.log('`🚀 Server listening at port 4000');
  });
};

main().catch((err) => console.log(err));
