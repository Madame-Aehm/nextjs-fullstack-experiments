import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import UserModal from '@/models/user';
import dbConnect from '@/lib/connectDB';

const resolvers = {
  Query: {
    users: async () => {
      try {
        await dbConnect();
        const users = await UserModal.find({});
        return users
      } catch (error) {
        console.log(error);
      }
    }
  },
};

const typeDefs = gql`
  type Query {
    users: [User]
  },
  type User {
    email: String
    username: String
    _id: String
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };