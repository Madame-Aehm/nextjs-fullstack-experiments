import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import resolvers from './resolvers';
import typeDefs from './typedefs';
import { getServerSession } from 'next-auth';

export type MyContext = {
  session: mySession
}

type mySession = null | {
  user: {
    email: string
    id: string
  }
}
const server = new ApolloServer<MyContext>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const session = await getServerSession() as mySession;
    return { session }
  },
});

export { handler as GET, handler as POST };