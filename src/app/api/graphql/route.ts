import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import resolvers from './resolvers';
import typeDefs from './typedefs';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';

export type MyContext = {
  session: Session | null
}

const server = new ApolloServer<MyContext>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const session = await getServerSession() as Session;
    console.log("from context", session)
    return { session: session }
  },
});

export { handler as GET, handler as POST };