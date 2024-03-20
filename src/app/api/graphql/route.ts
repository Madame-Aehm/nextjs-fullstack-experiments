import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import resolvers from './resolvers';
import typeDefs from './typedefs';
import { ContextUser } from '@/@types/user';
import { NextApiResponse } from 'next';
import { cookies } from 'next/headers';

export type MyContext = {
  user: ContextUser | null
  res: NextApiResponse
}
const server = new ApolloServer<MyContext>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const cookie = cookies().get("token");
    const token = cookie ? cookie.value : null;
    console.log("token", token);
    return { user: null, res }
  },
});

export { handler as GET, handler as POST };