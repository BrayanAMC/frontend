import { createHttpLink } from "@apollo/client";

export const httpLink = createHttpLink({
  uri: `https://${process.env.GATEWAY_DOMAIN}/graphql` || 'http://localhost:3002/graphql',
});