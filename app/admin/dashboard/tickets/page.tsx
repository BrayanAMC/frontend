'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { GET_ALL_TICKETS_QUERY } from "@/apollo/queries";
import TicketCard from "@/components/ticketCard/TicketCard";
import { useState } from "react";
import Pagination from 'react-bootstrap/Pagination';

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
    const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null);
    const [statusFilter, setStatusFilter] = useState("");

    const [hasMoreTickets, setHasMoreTickets] = useState(true);
    const limit = 3;
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const { loading, error, data } = useQuery(GET_ALL_TICKETS_QUERY, {
        variables: {
            ticketsInput: {
                limit: limit + 1,
                offset,
                status: statusFilter || undefined,
                archived: archivedFilter
            }
        },
        onCompleted: (data) => {
            setHasMoreTickets(data.tickets.length > limit);
        },
        onError: (error) => {
            if (error.message === 'No more tickets') {
                setHasMoreTickets(false);
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

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value);
        handlePageChange(0);
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

    const filteredTickets = tickets.filter((ticket: Ticket) => statusFilter ? ticket.status === statusFilter : true);
    if (loading) return <p>Loading...</p>;
    return (
        <div className="h-screen flex flex-col pb-20">
            <div>
                <label htmlFor="archived-filter">Filter by archived: </label>
                <select id="archived-filter" onChange={handleArchivedChange}>
                    <option value="">All</option>
                    <option value="true">Archived</option>
                    <option value="false">Not Archived</option>
                </select>
                {/* Resto del código... */}
            </div>
            <div>
                <label htmlFor="status-filter">Filter by status: </label>
                <select id="status-filter" onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value={TicketStatus.OPEN}>Open</option>
                    <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TicketStatus.CLOSED}>Closed</option>
                </select>
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Previous</button> {/* Deshabilita el botón "Previous" si currentPage es 1 */}

                <span className="mx-2">{currentPage}</span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasMoreTickets}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Next</button> {/* Deshabilita el botón "Next" si no se recibió un ticket adicional */}

            </div>
        </div>

    );


} export default () => (
    <ApolloProvider client={client}>
        <TicketsPage />
    </ApolloProvider>
);