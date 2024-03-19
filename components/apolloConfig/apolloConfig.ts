import { createHttpLink } from "@apollo/client";

export const httpLink = createHttpLink({
  uri: `https://${process.env.GATEWAY}/graphql` || 'http://localhost:3002/graphql',
});