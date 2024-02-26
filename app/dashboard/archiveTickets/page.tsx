'use client'
import { GET_TICKETS_ARCHIVED_BY_USER_ID_QUERY } from "@/apollo/queries";
import TicketCard from "@/components/ticketCard/TicketCard";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { gql } from "@apollo/client";
import { useState, useEffect } from 'react';
import { useSearchParams, useParams, ReadonlyURLSearchParams } from 'next/navigation';
import TicketArchivedCard from "@/components/ticketCard/TicketArchivedCard";

export enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
}

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: TicketStatus;
    createdAt: string;
    closedAt: string | null;
    userId: number;
    assignedToId: number | null;
}


    const httpLink = createHttpLink({
        uri: 'http://localhost:3002/graphql',
    });
    
    const client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });

function TicketPages() {

    const [userId, setUserId] = useState<number | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userIdString = localStorage.getItem('idUser');
            const userId = userIdString ? parseInt(userIdString) : null;
            setUserId(userId);
        }

    }, []);

    const { loading, error, data, refetch } = useQuery(GET_TICKETS_ARCHIVED_BY_USER_ID_QUERY, {
        variables: { userId: userId },
        skip: userId === null
    });

    const tickets = data?.getTicketsArchivedByUserId || [];

    useEffect(() => {
        if (userId !== null) {
            refetch();
        }
    }, [userId, refetch]);
    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {tickets.length === 0 ? (
                <p>Usted no tiene tickets aún.</p>
            ) : (
                tickets.map((ticket: Ticket) => (
                    <TicketArchivedCard ticket={ticket} path= "/dashboard/archiveTickets/ticket" key={ticket.id}/>
                ))
            )}
        </div>
    )


}export default () => (
    <ApolloProvider client={client}>
        <TicketPages />
    </ApolloProvider>
);