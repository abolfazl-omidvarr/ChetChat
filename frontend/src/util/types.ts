import {
  ConversationPopulated,
  MessagePopulated,
} from '../../../backend/src/util/types';
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}
export interface CreateUserData {
  createUser: {
    success: boolean;
    error: string;
  };
}

export interface LoginUserData {
  loginUser: {
    success: boolean;
    error: string;
    accessToken: string;
    userId: string;
  };
}

export interface CreateUsernameVariable {
  username: string;
}
export interface CreateUserVariable {
  username: string;
  email: string;
  password: string;
}
export interface LoginUserVariable {
  userMail: string;
  password: string;
}
export interface SearchUserInput {
  username: string;
}

export interface SearchUserData {
  searchUsers: Array<SearchedUsers>;
  errors: Array<ApolloError>;
}

export interface ApolloError {
  message: string;
  locations: any;
  extensions: {
    code: number | string;
  };
}

export interface SearchedUsers {
  id: string;
  username: string;
}
export interface LogOutData {
  success: boolean;
  error: string;
}
export interface getCurrentUserData {
  name?: string;
  email: string;
  username?: string;
  image?: string;
}

///////////////////////////////////conversations

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}

export interface ConversationData {
  conversations: Array<ConversationPopulated>;
}

export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: Omit<
        ConversationPopulated,
        'latestMessage' & { latestMessage: MessagePopulated }
      >;
    };
  };
}

export interface ConversationUpdatedData {
  conversationUpdated: ConversationPopulated;
}

//////////////////////////////////////message

export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}

//////////////////////////////////////test

export interface testData {
  test: {
    success: boolean;
    error: string;
  };
}

export interface testInput {
  a: string;
}
