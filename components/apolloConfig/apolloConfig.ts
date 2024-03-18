import { createHttpLink } from "@apollo/client";

export const httpLink = createHttpLink({
  uri: 'http://localhost:3002/graphql',
});