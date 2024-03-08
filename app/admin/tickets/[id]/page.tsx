/*'use client'
import { GET_TICKETS_BY_USER_ID_QUERY } from "@/apollo/queries";
import TicketCard from "@/components/ticketCard/TicketCard";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { gql } from "@apollo/client";
import { useState, useEffect } from 'react';
import { useSearchParams, useParams, ReadonlyURLSearchParams } from 'next/navigation';

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
    archived: boolean;
}

const columns = [
    { name: 'ID', selector: 'id', sortable: true },
    { name: 'Subject', selector: 'subject', sortable: true },
    { name: 'Description', selector: 'description', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
    // Agrega aquí las demás columnas que necesites
];

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
    const { id } = useParams();
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del usuario dueño del ticket
    const [userId, setUserId] = useState<number | null>(null);
    //console.log("userId: ",userId);

    
    //console.log("userId: ",userId);

    //let userId = null;




    const { loading, error, data, refetch } = useQuery(GET_TICKETS_BY_USER_ID_QUERY, {
        variables: { userId: idNumber },
        skip: idNumber === null
    });
    //console.log("imprimiendo data: ", data);
    //console.log("despues de llamar a la query", userId)


    const tickets = data?.getTicketsByUserId || [];

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
                    <TicketCard ticket={ticket} path="/admin/tickets/ticket" key={ticket.id} />
                ))
            )}
        </div>
    )
} export default () => (
    <ApolloProvider client={client}>
        <TicketPages />
    </ApolloProvider>
);
*/

'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { useState, useEffect, use } from 'react';
import DataTable from 'react-data-table-component';
import { GET_INSTITUTIONS_QUERY, GET_TICKETS_BY_USER_ID_QUERY } from "@/apollo/queries";
import {tableCustomStyles} from '@/components/tableComponent/tableStylesComponent';
import { useSearchParams, useParams, ReadonlyURLSearchParams } from 'next/navigation';


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
    institutionId: number;
    archived: boolean;

}


interface Institution {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;

}

const columns = [
    { name: 'ID', selector: (row: Ticket) => row.id, sortable: true },
    { name: 'Subject', selector: (row: Ticket) => row.subject, sortable: true },
    { name: 'Description', selector: (row: Ticket) => row.description, sortable: true },
    { name: 'Status', selector: (row: Ticket) => row.status, sortable: true },
    { name: 'Created At', selector: (row: Ticket) => row.createdAt, sortable: true },
    // Agrega aquí las demás columnas que necesites
];

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

function TicketsPage() {
    const { id } = useParams();
    const userId = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del usuario dueño del ticket
    const firstName = useSearchParams().get("firstName");
    const lastName = useSearchParams().get("lastName");

    const [statusFilter, setStatusFilter] = useState<TicketStatus | null>(null);
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [institutionFilter, setInstitutionFilter] = useState(0);

    const { loading, error, data, refetch } = useQuery(GET_TICKETS_BY_USER_ID_QUERY, {
        variables: { userId: userId },
        skip: userId === null
    });
    //console.log('data', data)
    const tickets = data?.getTicketsByUserId || [];
    //console.log('tickets:', tickets)

    const filteredTickets = tickets.filter((ticket: Ticket) => {
        if (statusFilter && ticket.status !== statusFilter) {
            return false;
        }
        if (dateFilter && new Date(ticket.createdAt) < dateFilter) {
            return false;
        }

        if (institutionFilter && ticket.institutionId !== institutionFilter) {
            return false;
        }
        return true;

    });

    const { loading: loadingInstitutions, error: errorInstitutions, data: dataInstitutions } = useQuery(GET_INSTITUTIONS_QUERY, {
        onCompleted: (data) => {
            // Set the initial institution value to the ID of the first institution

        },
    });

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <input  className="bg-[#16202a] text-white" type="date" value={dateFilter ? dateFilter.toISOString().substr(0, 10) : ''} onChange={e => setDateFilter(e.target.value ? new Date(e.target.value) : null)} />
            <select  className="bg-[#16202a] text-white" value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value as TicketStatus)}>
                <option value="">All</option>
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
            </select>
            <select className="bg-[#16202a] text-white" value={institutionFilter} onChange={e => setInstitutionFilter(+e.target.value)}>
                <option value={0}>All Institutions</option>
                {dataInstitutions?.institutions?.map((institution: Institution) => (
                    <option key={institution.id} value={institution.id}>{institution.name}</option>
                ))}
            </select>
            {filteredTickets.length === 0 ? (
                <p>Usted no tiene tickets aún.</p>
            ) : (
                <DataTable
                    customStyles={tableCustomStyles}
                    title={`Tickets de  ${firstName} ${lastName}`} 
                    columns={columns}
                    data={filteredTickets}
                    pagination
                    onRowClicked={row => {
                        const query = new URLSearchParams({
                            subject: row.subject,
                            description: row.description,
                            status: row.status,
                            createdAt: row.createdAt,
                            userId: String(row.userId),
                            archived: String(row.archived)
                        }).toString();

                        window.location.href = `/admin/tickets/ticket/${row.id}?${query}`;
                    }}
                />
            )}
        </div>
    )




} export default () => (
    <ApolloProvider client={client}>
        <TicketsPage />
    </ApolloProvider>
);
