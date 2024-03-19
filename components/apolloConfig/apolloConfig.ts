import { createHttpLink } from "@apollo/client";

export const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GATEWAY_DOMAIN ? `https://${process.env.NEXT_PUBLIC_GATEWAY_DOMAIN}/graphql` : 'http://localhost:3002/graphql',
});