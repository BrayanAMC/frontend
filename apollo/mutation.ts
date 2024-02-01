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

export const RECOVERY_PASSWORD_MUTATION = gql`
  mutation RecoveryPassword($recoveryPasswordInput: RecoveryPasswordInput!) {
    recoveryPassword(RecoveryPasswordInput: $recoveryPasswordInput) {
        success
        message
    }
  }
  `;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($changePasswordInput: ChangePasswordInput!) {
    changePassword(ChangePasswordInput: $changePasswordInput) {
        success
        message
    }
  }
  `;  

export const DELETE_TICKET_MUTATION = gql`
  mutation DeleteTicket($id: Int!) {
    deleteTicket(id: $id) {
        success
        message
    }
  }
  `;  
