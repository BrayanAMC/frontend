import { gql } from "@apollo/client";

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($loginUserInput: LoginUserInput!) {
    login(LoginUserInput: $loginUserInput) {
        id
        firstName
        lastName
        email
        accessToken
    }
  }
`;
