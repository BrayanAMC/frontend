/*'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { GET_ALL_TICKETS_QUERY } from "@/apollo/queries";
import TicketCard from "@/components/ticketCard/TicketCard";
import { useState } from "react";
import Pagination from 'react-bootstrap/Pagination';
import { useEffect } from 'react';

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

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
function TicketsPage() {
    //constantes de los filtros
    const [dateFilter, setDateFilter] = useState("");
    const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null);
    const [statusFilter, setStatusFilter] = useState("");

    const [hasMoreTickets, setHasMoreTickets] = useState(true);
    const limit = 3;
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const { loading, error, data, refetch } = useQuery(GET_ALL_TICKETS_QUERY, {
        variables: {
            ticketsInput: {
                limit: limit + 1,
                offset,
                status: statusFilter || undefined,
                archived: archivedFilter,
                date: dateFilter ? new Date(dateFilter).toISOString() : undefined
            }
        },
        onCompleted: (data) => {
            setHasMoreTickets(data.tickets.length > limit);
        },
        onError: (error) => {
            if (error.message === 'No more tickets') {
                setHasMoreTickets(false);
                // Preserve the state of your filters
                setArchivedFilter(archivedFilter);
                setStatusFilter(statusFilter);
                setDateFilter(dateFilter);
            }
        }
    });

    console.log("data,tickets", data?.tickets);
    //const tickets = data?.tickets || [];
    const tickets = data?.tickets.slice(0, limit) || []; // Solo utiliza los primeros 'limit' tickets

    //funciones de los filtros.
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 0) {
            setCurrentPage(pageNumber);
            setOffset((pageNumber) * limit);
        }
    };

    useEffect(() => {
        refetch();
    }, [statusFilter, archivedFilter, dateFilter, offset]);

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        // Actualiza el estado de statusFilter con el nuevo valor
        if (value === 'OPEN' || value === 'CLOSED' || value === 'IN_PROGRESS') {
            setStatusFilter(value);
        } else {
            setStatusFilter(""); // Si el valor es "ALL", establece statusFilter a una cadena vacía
        }
        handlePageChange(0);
        //refetch(); // Refetch the query after changing the filter
    };

    const handleArchivedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        // Actualiza el estado de archivedFilter con el nuevo valor
        if (value === 'true') {
            setArchivedFilter(true);
        } else if (value === 'false') {
            setArchivedFilter(false);
        } else {
            setArchivedFilter(null); // Si el valor es "", establece archivedFilter a null
        }
        handlePageChange(0);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setDateFilter(value);
        handlePageChange(0);
    };

    const filteredTickets = tickets
        .filter((ticket: Ticket) => statusFilter ? ticket.status === statusFilter : true)
        .filter((ticket: Ticket) => {
            if (dateFilter) {
                const ticketDate = new Date(ticket.createdAt);
                const filterDate = new Date(dateFilter);

                return ticketDate.getFullYear() > filterDate.getFullYear()
                    || (ticketDate.getFullYear() === filterDate.getFullYear() && ticketDate.getMonth() > filterDate.getMonth())
                    || (ticketDate.getFullYear() === filterDate.getFullYear() && ticketDate.getMonth() === filterDate.getMonth() && ticketDate.getDate() >= filterDate.getDate());
            }

            return true;
        });

    if (loading) return <p>Loading...</p>;
    return (
        <div className="h-screen flex flex-col pb-20">
            <div>
                <label htmlFor="archived-filter">Filter by archived: </label>
                <select id="archived-filter" onChange={handleArchivedChange} >
                    <option value="">All</option>
                    <option value="true">Archived</option>
                    <option value="false">Not Archived</option>
                </select>

            </div>
            <div>
                <label htmlFor="status-filter">Filter by status: </label>
                <select id="status-filter" onChange={handleStatusChange} value={statusFilter}>
                    <option value="">All</option>
                    <option value={TicketStatus.OPEN}>Open</option>
                    <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TicketStatus.CLOSED}>Closed</option>
                </select>
            </div>
            <div>
                <label htmlFor="date-filter">Filter by date: </label>
                <input type="date" id="date-filter" onChange={handleDateChange} value={dateFilter} />
            </div>
            <div className="flex-grow">
                {tickets.length === 0 ? (
                    <p>There are no tickets yet.</p>
                ) : (
                    filteredTickets.map((ticket: Ticket) => (
                        <TicketCard ticket={ticket} path="/admin/dashboard/tickets" key={ticket.id} />
                    ))
                )}
            </div>
            <div className="flex justify-center items-center space-x-4">

                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Previous</button> 

                <span className="mx-2">{currentPage}</span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasMoreTickets}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Next</button> 

            </div>
        </div>

    );


} export default () => (
    <ApolloProvider client={client}>
        <TicketsPage />
    </ApolloProvider>
);

*/

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