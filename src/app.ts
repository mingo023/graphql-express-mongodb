require('dotenv').config();
import express, { Request, Response } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import mongoDB from './db/mongoose';

const types = importSchema('./src/graphql/schemas/schema.graphql');
import { getResolver } from './graphql/resolver';

const resolvers = getResolver();

const app = express();

mongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => res.send('Hello'));

const typeDefs = gql`
  ${types}
`;

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
