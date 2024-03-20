const typeDefs = `#graphql
  type Query {
    users: [User]
  }
  type Mutation {
    signUp(signUpValues: signUpValues!): User
    login(loginValues: loginValues!): User
  }
  input signUpValues {
    email: String!
    password: String!
    username: String!
  }
  input loginValues {
    email: String!
    password: String!
  }
  type User {
    email: String!
    username: String!
    _id: String!
  }
  type AuthenticatedUser {
    token: String!
    user: User!
  }
`;

export default typeDefs