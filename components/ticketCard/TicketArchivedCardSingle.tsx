'use client'
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { GET_REPORT_QUERY } from "@/apollo/queries";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client";
import { generateReport } from '@/components/generateReport/generateReport';

const httpLink = createHttpLink({
    uri: "http://localhost:3002/graphql",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

type TicketProps = {
    id: string | number;
    subject: string;
    description: string;
    status: string;
    createdAt: string;
    userId: number;
};


function TicketArchivedCardSingle({ id, subject, description, status, createdAt, userId }: TicketProps) {

    const [isReportCreated, setReportCreated] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(`reportCreatedForTicket${id}`)) {
            setReportCreated(true);
        }
    }, [id]);

    //llamada a la api para obtener el reporte
    console.log("reportId ", id);
    let reportIdInt = null;

    // Verifica si window está definido
    if (typeof window !== 'undefined') {
        // Si window está definido, entonces estamos en el cliente y podemos acceder a localStorage
        reportIdInt = localStorage.getItem(`reportIdForTicket${id}`) ? parseInt(localStorage.getItem(`reportIdForTicket${id}`) as string, 10) : null;
    }
    console.log("reportIdInt ", reportIdInt);
    const { loading, error, data, refetch } = useQuery(GET_REPORT_QUERY, {

        variables: { id: reportIdInt },
        skip: reportIdInt === null
    });
    const handleViewReport = async (e: React.FormEvent) => {
        console.log("en funcion handleViewReport");

        refetch().then(response => {
            console.log("data getReport ", response.data);
            //transformar data a pdf
            generateReport(response.data);
        });
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 ">
            <div className=" relative p-8 bg-white rounded shadow-md w-1/2 mt-12">
                <Label>Subject</Label>
                <h2 className="text-xl font-semibold mb-2 break-words overflow-auto">{subject}</h2>
                <hr className="my-4 border-gray-200" />



                <Label>Description</Label>
                <p className="mb-4 break-words overflow-auto">{description}</p>
                <hr className="my-4 border-gray-200" />
                <p className="mb-4">{createdAt}</p>

                <span
                    className={`inline-block px-3 py-1 rounded text-white ${status === "OPEN"
                        ? "bg-green-500"
                        : status === "IN_PROGRESS"
                            ? "bg-yellow-500"
                            : status === "CLOSED"
                                ? "bg-red-500"
                                : ""
                        }`}
                >
                    {status}
                </span>
                {isReportCreated && (
                    <div>
                        <button className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-blue-500 text-white rounded-full"
                            onClick={(e) => { handleViewReport(e) }} disabled={!subject || !description || !status || !createdAt} >Ver reporte</button>
                    </div>
                )}
            </div>
        </div>
    );
}export default ({ id, subject, description, status, createdAt, userId }: TicketProps) => (
    <ApolloProvider client={client}>
        <TicketArchivedCardSingle
            id={id}
            subject={subject}
            description={description}
            status={status}
            createdAt={createdAt}
            userId={userId}
        />
    </ApolloProvider>
)