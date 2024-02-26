import { gql } from "@apollo/client";

export const GET_TICKETS_BY_USER_ID_QUERY = gql`
  query GetTicketsByUserId($userId: Int!) {
    getTicketsByUserId(userId: $userId) {
      id
      subject
      description
      status
      createdAt
      closedAt
      userId
    }
  }
`;


export const GET_TICKETS_ARCHIVED_BY_USER_ID_QUERY = gql`
  query GetTicketsArchivedByUserId($userId: Int!) {
    getTicketsArchivedByUserId(userId: $userId) {
      id
      subject
      description
      status
      createdAt
      closedAt
      userId
    }
  }
`;

export const GET_INSTITUTIONS_QUERY = gql`
  query GetInstitutions {
    institutions {
      id
      name
      email
      phoneNumber
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      password
      accessToken
      recoveryPasswordToken
      role
      institutionId
    }
  }
`;

export const GET_REPORT_QUERY = gql`
  query GetReport($id: Int!) {
    pdf (id: $id){
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

