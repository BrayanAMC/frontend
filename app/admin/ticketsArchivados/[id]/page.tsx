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
    console.log("antes de llamar a la query")

function TicketPages() {
    //const userIdString = localStorage.getItem('idUser');
    //const userId = userIdString ? parseInt(userIdString) : 0;
    //const [userId, setUserId] = useState(0);
    const { id }  = useParams();
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del usuario dueño del ticket
    const [userId, setUserId] = useState<number | null>(null);
    const sorted = useSearchParams();
    const email = sorted.get("email") || "";
    //console.log("userId: ",userId);

    /*useEffect(() => {
        if (typeof window !== 'undefined') {
            const userIdString = localStorage.getItem('idUser');
            const userId = userIdString ? parseInt(userIdString) : null;
            setUserId(userId);
        }
    }, []);*/
    //console.log("userId: ",userId);

    //let userId = null;
    

    
    
    const { loading, error, data, refetch } = useQuery(GET_TICKETS_ARCHIVED_BY_USER_ID_QUERY, {
        variables: { userId: idNumber },
        skip: idNumber === null
    });
    //console.log("imprimiendo data: ", data);
    //console.log("despues de llamar a la query", userId)
    
    
    const tickets = data?.getTicketsArchivedByUserId || [];

    // Refetch tickets each time the component is rendered
    useEffect(() => {
        if (idNumber !== null) {
            refetch();
        }
    }, [userId, refetch]);

    //console.log("imprimmiendo tickets: ", tickets);
    if (loading) return <p>Loading...</p>;
    //if (error) return <p>Error</p>;
    return (
        <div>
            {tickets.length === 0 ? (
                <p>Usted no tiene tickets aún.</p>
            ) : (
                tickets.map((ticket: Ticket) => (
                    <TicketArchivedCard ticket={ticket} path= "/admin/ticketsArchivados/ticket" key={ticket.id} email={email}/>
                ))
            )}
        </div>
    )
}export default () => (
    <ApolloProvider client={client}>
        <TicketPages />
    </ApolloProvider>
);