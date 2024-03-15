'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { GET_INSTITUTIONS_QUERY, TEST_GET_ALL_TICKETS_QUERY } from "@/apollo/queries";
import { tableCustomStyles } from '@/components/tableComponent/tableStylesComponent';
import { generateReport } from '@/components/generateReport/generateReport';
import { GET_REPORT_QUERY } from "@/apollo/queries";
import { Button } from "@/components/ui/button"
import {Ticket, TicketStatus, Institution} from "@/interfaces/interfaces";

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

function TestTicketsPage() {

    let [reportIdInt, setReportIdInt] = useState<number | null>(null);

    const [statusFilter, setStatusFilter] = useState<TicketStatus | null>(null);
    //const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
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
        /*if (dateFilter && new Date(ticket.createdAt) < dateFilter) {
            return false;
        }*/
        if (startDateFilter) {
            console.log('startDateFilter:', startDateFilter)
            //let startOfDay = new Date(startDateFilter)
            //startOfDay.setHours(0,0,0,0);
            //let filterData = new Date(startDateFilter).setHours(0, 0, 0, 0);
            const ticketDate = new Date(ticket.createdAt)
            if (ticketDate < startDateFilter) {
                return false;
            }
        }
        if (endDateFilter) {
            console.log('endDateFilter:', endDateFilter)
            endDateFilter.setHours(23, 59, 59, 999);
            console.log('endDateFilter despues de setHours:', endDateFilter)
            //let endOfDay = new Date(endDateFilter)
            //endOfDay.setHours(23, 59, 59, 999);
            const ticketDate = new Date(ticket.createdAt)
            //ticketDate.setHours(23, 59, 59, 999);
            if (ticketDate > endDateFilter) {
                return false;
            }
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
    //console.log('dataInstitutions:', dataInstitutions)

    const columns = [
        {
            name: 'Institution',
            cell: (row: Ticket) => {
                const institution = dataInstitutions?.institutions?.find((institution: Institution) => String(institution.id) === String(row.institutionId));
                //console.log(row.institutionId)
                return institution ? institution.name : 'N/A';
            },
            sortable: true
        },
        { name: 'Subject', selector: (row: Ticket) => row.subject, sortable: true },
        { name: 'Description', selector: (row: Ticket) => row.description, sortable: true },
        { name: 'Status', selector: (row: Ticket) => row.status, sortable: true },
        { name: 'Created At', selector: (row: Ticket) => new Date(row.createdAt).toLocaleDateString().substr(0, 10), sortable: true },
        {
            name: 'Descargar informe',
            cell: (row: Ticket) => {
                const reportIdFromStorage = localStorage.getItem(`reportIdForTicket${row.id}`) ? parseInt(localStorage.getItem(`reportIdForTicket${row.id}`) as string, 10) : null;
                return (
                    <Button 
                    onClick={() => handleViewReport(row.id)}
                    className="w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-700 mb-6"
                    disabled={reportIdFromStorage === null}
                    >
                        Descargar Informe
                    </Button>
                );
            },
        },
        // Agrega aquí las demás columnas que necesites
    ];


    console.log("reportIdInt", reportIdInt)
    const { loading: loadingReport, error: errorReport, data: dataReport, refetch: refetchReport } = useQuery(GET_REPORT_QUERY, {

        variables: { id: reportIdInt },
        skip: reportIdInt === null
    });

    useEffect(() => {
        const fetchData = async () => {
            if (reportIdInt !== null) {
                const response = await refetchReport();
                console.log("data getReport ", response.data);
                // Check if data is defined before calling generateReport
                if (response.data && response.data.pdf ) {
                    //transformar data a pdf
                    generateReport(response.data);
                } else {
                    console.log("Data is not yet available. Waiting for data...");
                    alert("Este ticket no tiene un informe.");
                }
            }
        };
    
        fetchData();
    }, [reportIdInt, refetchReport]);
    
    const handleViewReport = (ticketId: number) => {
        if (typeof window !== 'undefined') {
            // Si window está definido, entonces estamos en el cliente y podemos acceder a localStorage
            const reportIdFromStorage = localStorage.getItem(`reportIdForTicket${ticketId}`) ? parseInt(localStorage.getItem(`reportIdForTicket${ticketId}`) as string, 10) : null;
            setReportIdInt(reportIdFromStorage);
            if (reportIdFromStorage === null) {
                alert("Este ticket no tiene un informe.");
            }
        }
    };

    if (loading || loadingInstitutions) return <p className="text-white">Loading...</p>;

    if (error || errorInstitutions) return <p className="text-white">Error...</p>;

    if (!dataInstitutions) return <p className="text-white">Loading institutions...</p>;

    // Ahora puedes estar seguro de que dataInstitutions no es undefined cuando se renderiza la tabla

    return (
        <div>
            {/*<input className="bg-[#16202a] text-white" type="date" value={dateFilter ? dateFilter.toISOString().substr(0, 10) : ''} onChange={e => setDateFilter(e.target.value ? new Date(e.target.value) : null)} />*/}
            <input className="bg-[#16202a] text-white" type="date" value={startDateFilter ? new Date(startDateFilter.getTime() - startDateFilter.getTimezoneOffset() * 60000).toISOString().substr(0, 10) : ''} onChange={e => setStartDateFilter(e.target.value ? new Date(e.target.value + 'T00:00:00') : null)} />
            <input className="bg-[#16202a] text-white" type="date" value={endDateFilter ? new Date(endDateFilter.getTime() - endDateFilter.getTimezoneOffset() * 60000).toISOString().substr(0, 10) : ''} onChange={e => setEndDateFilter(e.target.value ? new Date(e.target.value + 'T00:00:00') : null)} />
            <select className="bg-[#16202a] text-white" value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value as TicketStatus)}>
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

}
const TestTicketsPageComponent = () => (
    <ApolloProvider client={client}>
        <TestTicketsPage />
    </ApolloProvider>
); 
TestTicketsPageComponent.displayName = 'TestTicketsPageComponent';
export default TestTicketsPageComponent;
