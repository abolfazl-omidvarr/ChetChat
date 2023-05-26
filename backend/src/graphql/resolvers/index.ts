import userResolvers from './user';
import conversationResolvers from './conversation';
import messageResolvers from './message';
import test from './test';

import merge from 'lodash.merge';

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  test
);

export default resolvers;
