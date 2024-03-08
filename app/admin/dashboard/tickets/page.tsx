'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { GET_INSTITUTIONS_QUERY, TEST_GET_ALL_TICKETS_QUERY } from "@/apollo/queries";
import {tableCustomStyles} from '@/components/tableComponent/tableStylesComponent';

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

function TestTicketsPage() {

    const [statusFilter, setStatusFilter] = useState<TicketStatus | null>(null);
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [institutionFilter, setInstitutionFilter] = useState(0);
    const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null);

    const { loading, error, data, refetch } = useQuery(TEST_GET_ALL_TICKETS_QUERY)
    //console.log('data', data)
    const tickets = data?.testingTickets || [];
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
        if (archivedFilter !== null && ticket.archived !== archivedFilter) {
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
            <input className="bg-[#16202a] text-white" type="date" value={dateFilter ? dateFilter.toISOString().substr(0, 10) : ''} onChange={e => setDateFilter(e.target.value ? new Date(e.target.value) : null)} />
            <select className="bg-[#16202a] text-white" value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value as TicketStatus)}>
                <option value="">All</option>
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
            </select>
            <select className="bg-[#16202a] text-white" value={institutionFilter} onChange={e => setInstitutionFilter(+e.target.value)}>
                <option value={0}>All Institutions</option>
                {dataInstitutions?.institutions?.map((institution: Institution) => (
                    <option value={institution.id}>{institution.name}</option>
                ))}
            </select>
            <select className="bg-[#16202a] text-white" value={archivedFilter === null ? '' : archivedFilter.toString()} onChange={e => setArchivedFilter(e.target.value === '' ? null : e.target.value === 'true')}>
                <option value="">Todos</option>
                <option value="true">Archivados</option>
                <option value="false">No Archivados</option>
            </select>
            {filteredTickets.length === 0 ? (
                <p>Usted no tiene tickets aún.</p>
            ) : (
                <DataTable
                    customStyles={tableCustomStyles}
                    title="Tickets"
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

                        window.location.href = `/admin/dashboard/tickets/${row.id}?${query}`;
                    }}
                />
            )}
        </div>
    )




} export default () => (
    <ApolloProvider client={client}>
        <TestTicketsPage />
    </ApolloProvider>
);