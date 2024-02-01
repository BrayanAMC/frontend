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