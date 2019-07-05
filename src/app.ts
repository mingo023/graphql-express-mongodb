require('dotenv').config();
import express, { Request, Response } from 'express';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import mongoDB from './db/mongoose';
import handleToken from './utils/handle-auth';

import { getResolver } from './graphql/resolver';
const resolvers = getResolver();

mongoDB();

const types = importSchema('./src/graphql/schemas/schema.graphql');
const typeDefs = gql`
  ${types}
`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => res.send('Hello'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token: string = req.headers.authorization;

    try {
      const user = await handleToken(token);
      if (!user) {
        throw new AuthenticationError('your request must have token');
      }
      return null;
    } catch (err) {
      return err;
    }
  },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(
    `🔥🔥🔥🔥 Server ready at http://localhost:4000${
      server.graphqlPath
    } 🔥🔥🔥🔥`
  )
);
