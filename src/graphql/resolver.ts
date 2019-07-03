import { readdirSync } from 'fs';
import { resolve } from 'path';

type Resolver = {
  [key: string]: any;
};

export function getResolver(): Resolver {
  const resolvers: Resolver = {};

  const queries = readdirSync(resolve('src/graphql/resolvers/queries'));
  queries.forEach(query => {
    const fileName = resolve(__dirname, 'resolvers/queries', query);
    const module = require(fileName);

    resolvers.Query = {
      ...resolvers.Query,
      ...module,
    };
  });

  const mutations = readdirSync(resolve('src/graphql/resolvers/mutations'));
  mutations.forEach(mutation => {
    const fileName = resolve(__dirname, 'resolvers/queries', mutation);
    const module = require(fileName);

    resolvers.Mutation = {
      ...resolvers.Mutation,
      ...module,
    };
  });

  return resolvers;
}
