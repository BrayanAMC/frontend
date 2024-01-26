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

export const REGISTER_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(CreateUserInput: $createUserInput) {
        id
        firstName
        lastName
        email
        accessToken
        recoveryPasswordToken
    }
  }
  `;
