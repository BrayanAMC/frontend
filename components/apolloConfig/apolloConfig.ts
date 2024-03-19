import { createHttpLink } from "@apollo/client";

export const httpLink = createHttpLink({
  uri: `https://${process.env.NEXT_PUBLIC_GATEWAY}/graphql` || 'http://localhost:3002/graphql',
});