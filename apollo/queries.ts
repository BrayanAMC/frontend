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
      institutionId
      archived
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
      institutionId
      archived
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

export const GET_INSTITUTION_QUERY = gql`
  query GetInstitution($id: Int!) {
    institution(id: $id) {
      id
      name
      email
      phoneNumber
    }
  }
`;


export const GET_ALL_TICKETS_QUERY = gql`
  query GetAllTickets($ticketsInput: TicketsInput!) {
    tickets(TicketsInput: $ticketsInput) {
      id
      subject
      description
      status
      createdAt
      closedAt
      userId
      institutionId
      archived
    }
  }
`;

export const TEST_GET_ALL_TICKETS_QUERY = gql`
  query GetAllTickets {
    testingTickets {
      id
      subject
      description
      status
      createdAt
      closedAt
      userId
      institutionId
      archived
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      role
      institutionId
    }
  }
`;