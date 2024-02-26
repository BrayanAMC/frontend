import { gql } from "@apollo/client";

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($loginUserInput: LoginUserInput!) {
    login(LoginUserInput: $loginUserInput) {
      id
      firstName
      lastName
      email
      accessToken
      role
      institutionId
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
      role
      institutionId
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

export const CREATE_TICKET_MUTATION = gql`
  mutation CreateTicket($createTicketInput: CreateTicketInput!) {
    createTicket(CreateTicketInput: $createTicketInput) {
      id
      subject
      description
      status
      createdAt
      closedAt
      userId
      institutionId
      assignedToId
    }
  }
`;

export const CREATE_INSTITUTION_MUTATION = gql`
  mutation CreateInstitution($createInstitutionInput: CreateInstitutionInput!) {
    createInstitution(CreateInstitutionInput: $createInstitutionInput) {
      id
      name
      email
      phoneNumber
    }
  }
`;

export const DELETE_INSTITUTION_MUTATION = gql`
  mutation DeleteInstitution($id: Int!) {
    deleteInstitution(id: $id) {
      success
      message
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($deleteUserInput: DeleteUserInput!) {
    deleteUser(DeleteUserInput: $deleteUserInput) {
      success
      message
    }
  }
`;

export const UPDATE_INSTITUTION_MUTATION = gql`
  mutation UpdateInstitution($updateInstitutionInput: UpdateInstitutionInput!) {
    updateInstitution(UpdateInstitutionInput: $updateInstitutionInput) {
      id
      name
      email
      phoneNumber
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(UpdateUserInput: $updateUserInput) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_TICKET_MUTATION = gql`  
  mutation UpdateTicket($updateTicketInput: UpdateTicketInput!) {
    updateTicket(UpdateTicketInput: $updateTicketInput) {
      id
      subject
      description
      status
      createdAt
      closedAt
      userId
      assignedToId
    }
  }
`;

export const CHANGE_STATUS_TO_IN_PROGRESS_MUTATION = gql`
  mutation ChangeStatusToInProgress($id: Int!, $userId: Int!, $assignedToId: Int!) {
    changeStatusToInProgress(id: $id, userId: $userId, assignedToId: $assignedToId) {
      success
      message
    }
  }
`;

export const CHANGE_STATUS_TO_CLOSED_MUTATION = gql`
  mutation ChangeStatusToClosed($id: Int!, $userId: Int!, $assignedToId: Int!) {
    changeStatusToClosed(id: $id, userId: $userId, assignedToId: $assignedToId) {
      success
      message
    }
  }
`;

export const CREATE_REPORT_MUTATION = gql`
mutation CreatePdf($createPdfInput: CreatePdfInput!) {
  createPdf(CreatePdfInput: $createPdfInput) {
    id
    nombre
    localidad
    fecha
    tipoDeVisita
    problemaEncontrado
    detalleProblema
    trabajoRealizado
    detalleTrabajo
    observaciones
    ticketId
  }
}
`;

export const ARCHIVE_REPORT_MUTATION = gql`
  mutation ArchiveTicket($ticketId: Int!) {
    archiveTicket(ticketId: $ticketId) {
      success
      message
    }
  }
`;