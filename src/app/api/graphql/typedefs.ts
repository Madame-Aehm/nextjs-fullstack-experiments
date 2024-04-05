const typeDefs = `#graphql
  type Query {
    users: [User]
    getMe: User
    messages(chatId: String!): [Message]
  }
  type Mutation {
    signUp(signUpValues: signUpValues!): User
    updateProfile(updatableValues: updatableValues!): User
    login(loginValues: loginValues!): User
    sendMessage(messageValues: messageValues!): String
  }
  type User {
    email: String!
    username: String!
    picture: Picture
    _id: String!
  }
  type Picture {
    url: String!
    public_id: String
  }
  type Message {
    _id: String!
    sent: User!
    message: String!
    chatId: String!
    createdAt: String!
  }
  input signUpValues {
    email: String!
    password: String!
    username: String!
  }
  input updatableValues {
    email: String
    username: String
    picture: String
  }
  input loginValues {
    email: String!
    password: String!
  }
  input messageValues {
    sent: String!
    message: String!
    chatId: String!
  }
`;

export default typeDefs