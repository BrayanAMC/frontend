'use client'
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { GET_REPORT_QUERY} from "@/apollo/queries";
import { SEND_REPORT_TO_USER_MUTATION } from "@/apollo/mutation";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider, useMutation } from "@apollo/client";
import { generateReport } from '@/components/generateReport/generateReport';
import { generateReportToBase64 } from '@/components/generateReport/generateReport';
import { TicketProps } from "@/interfaces/interfaces";

const httpLink = createHttpLink({
    uri: "http://localhost:3002/graphql",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});


function TicketArchivedCardSingle({ id, subject, description, status, createdAt, userId, email }: TicketProps) {

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
    //fin llamada a la api para obtener el reporte

   
    const handleViewReport = async (e: React.FormEvent) => {
        console.log("en funcion handleViewReport");

        refetch().then(response => {
            console.log("data getReport ", response.data);
            //transformar data a pdf
            generateReport(response.data);
        });
    }
    //inicio llamada a la api para enviar el reporte
    const [sendReport] = useMutation(SEND_REPORT_TO_USER_MUTATION,{
        client,
    });
    
    const handleSendReport = async (e: React.FormEvent) => {
        console.log("en funcion handleSendReport");
    
        refetch().then(async response => {
            //console.log("data getReport 2", response.data);
            
            // Transformar data a PDF en formato base64
            const pdfBase64 = generateReportToBase64(response.data);
            //console.log("pdfBase64 ", pdfBase64);
            // Aquí puedes enviar pdfBase64 al backend
            const { data } = await sendReport({
                variables: {
                    sendPdfToUserInput: {
                      email: email,
                      pdfBase64: pdfBase64
                    }
                }
            });
    
            console.log("Mutation response data: ", data);
            if (data.sendPdfToUser.success) {
                alert("Reporte enviado al usuario");
            }else{
                alert("Error al enviar el reporte");
            }
        });
        
    }
     //fin llamada a la api para enviar el reporte

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#16202a] ">
            <div className=" relative p-8 bg-[#26313c] rounded shadow-md w-1/2 mt-12">
                <Label className="text-white">Subject</Label>
                <h2 className="text-xl text-white font-semibold mb-2 break-words overflow-auto">{subject}</h2>
                <hr className="my-4 border-gray-200" />



                <Label className="text-white">Description</Label>
                <p className="text-white mb-4 break-words overflow-auto">{description}</p>
                <hr className="my-4 border-gray-200" />
                <p className="mb-4 text-white">{createdAt}</p>
                <hr className="my-4 border-gray-200" />

                <Label className="text-white">Correo usuario</Label>
                <h2 className="text-xl text-white font-semibold mb-2 break-words overflow-auto">{email}</h2>
                <hr className="my-4 border-gray-200" />

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

                        <button className="absolute bottom-0 right-0 mb-4 mr-40 p-2 bg-yellow-500 text-white rounded-full"
                            onClick={handleSendReport}
                            disabled={!subject || !description || !status || !createdAt}
                        >
                            Enviar reporte al usuario
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 
const TicketArchivedCardSingleComponent = ({ id, subject, description, status, createdAt, userId, email }: TicketProps) => (
    <ApolloProvider client={client}>
        <TicketArchivedCardSingle
            id={id}
            subject={subject}
            description={description}
            status={status}
            createdAt={createdAt}
            userId={userId}
            email={email}
        />
    </ApolloProvider>
);
TicketArchivedCardSingleComponent.displayName = 'TicketArchivedCardSingleComponent';
export default TicketArchivedCardSingleComponent;