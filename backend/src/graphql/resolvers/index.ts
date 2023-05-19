import userResolvers from './user';
import conversationResolvers from './conversation';
import test from './test';
// import messageResolvers from "./message";

import merge from 'lodash.merge';

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  test
  // messageResolvers
);

export default resolvers;
