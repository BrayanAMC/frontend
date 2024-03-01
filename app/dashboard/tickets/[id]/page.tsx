/*async function loadTicket(id){
    const response = await fetch(`http://localhost:3000/api/tickets/${id}`);
    const data = await response.json();
    console.log(data);

}*/

/*export default function TicketPages() {
    return (
        <div>
            <h1>TicketPages</h1>
            
        </div>
    )
}*/
"use client";
import {
  useSearchParams, useParams,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  useMutation,
  useQuery,
  ApolloProvider
} from "@apollo/client";
import {
  DELETE_TICKET_MUTATION,
  UPDATE_TICKET_MUTATION,
  ARCHIVE_REPORT_MUTATION,
} from "@/apollo/mutation";
import { parse } from "path";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GET_REPORT_QUERY } from "@/apollo/queries";
import jsPDF from "jspdf";
import { generateReport } from '@/components/generateReport/generateReport';


const httpLink = createHttpLink({
  uri: "http://localhost:3002/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function TicketPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstNameUser = localStorage.getItem("firstNameUser");
      const lastNameUser = localStorage.getItem("lastNameUser");
      const emailUser = localStorage.getItem("emailUser");
      setFirstNameUser(firstNameUser);
      setLastNameUser(lastNameUser);
      setEmailUser(emailUser);
    }
  }, []);



  const [firstNameUser, setFirstNameUser] = useState<string | null>(null);
  const [lastNameUser, setLastNameUser] = useState<string | null>(null);
  const [emailUser, setEmailUser] = useState<string | null>(null);

  //const router = useRouter();
  const { id } = useParams();
  const [isReportCreated, setReportCreated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`reportCreatedForTicket${id}`)) {
      setReportCreated(true);
    }
  }, [id]);

  const sorted = useSearchParams();
  const [subject, setSubject] = useState(sorted.get("subject"));
  const [description, setDescription] = useState(sorted.get("description"));
  

  const status = sorted.get("status");
  const createdAt = sorted.get("createdAt");
  const userId = sorted.get("userId"); //id del usuario dueño del ticket
  const archived = sorted.get("archived");


  const [deleteTicket] = useMutation(DELETE_TICKET_MUTATION, {
    client,
  });

  const [updateTicket] = useMutation(UPDATE_TICKET_MUTATION, {
    client,
  });

  const [archiveReport] = useMutation(ARCHIVE_REPORT_MUTATION, {
    client,
  });

  const handleDeleteTicket = async (e: React.FormEvent) => {
    if (status === "OPEN" || status === "CLOSED") {
      console.log("en funcion handleDeleteTicket");
      const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);
      const input = {
        id: id,
      };

      const { data } = await deleteTicket({
        variables: { id: idNumber },
      });
      console.log("datos de la api llamada [id]: ", data);
      if (data?.deleteTicket.success) {
        alert("Ticket eliminado correctamente.");
        window.location.href = "/dashboard/tickets";
      }
    } else {
      alert("No puedes eliminar un ticket que está en progreso.");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);

    const { data } = await updateTicket({
      variables: {
        updateTicketInput: {
          id: idNumber,
          subject: subject,
          description: description,
        },
      },
    });
    console.log("data update ticket ", data);
    if (data?.updateTicket.id) {
      alert("Ticket updated successfully");
      window.location.href = "/dashboard/tickets";
    }
  };

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

  const handleArchiveTicket = async (e: React.FormEvent) => {
    console.log("en funcion handleArchiveTicket");
    const ticketId = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del ticket pasado a entero
    console.log("ticketId ", ticketId);
    try {
      const { data } = await archiveReport({
        variables: {
          ticketId: ticketId,
        },
      });
      console.log("data archiveReport ", data);

      if (data?.archiveTicket.success) {
        alert("Ticket archivado correctamente.");
        window.location.href = `/admin/tickets/${userId}`;
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }
  //const { subject } = useParams();

  //await loadTicket(params.ticketId);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 ">
      <div className=" relative p-8 bg-white rounded shadow-md w-1/2 mt-12">
        <h1 className="text-2xl font-bold mb-4">
          {firstNameUser} {lastNameUser}
        </h1>
        <p className="mb-4">{emailUser}</p>
        <hr className="my-4 border-gray-200" />
        <Label>Subject</Label>
        <h2 className="text-xl font-semibold mb-2 break-words overflow-auto">
          {subject}
        </h2>
        <hr className="my-4 border-gray-200" />
        <Label>Description</Label>
        <p className="mb-4 break-words overflow-auto">{description}</p>
        <hr className="my-4 border-gray-200" />
        <Label>Fecha de creacion</Label>
        <p className="mb-4">{createdAt}</p>
        <hr className="my-4 border-gray-200" />
        <div className="inline-flex flex-col ">
          <Label className="mb-2">Status</Label>
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
        </div>

        <></>
        <hr className="my-4 border-gray-200" />
        <div className="mb-6">

          {status !== "IN_PROGRESS" && status !== "CLOSED" && (
            <div>
              <Label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </Label>
              <Input
                value={subject || ""}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={100} // Limita la entrada a 100 caracteres
              /></div>
          )}
        </div>
        <div className="mb-6">

          {status !== "IN_PROGRESS" && status !== "CLOSED" && (
            <div>
              <Label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </Label>
              <textarea
                className="w-full"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={5} // Ajusta esto para cambiar la altura
                maxLength={300} // Limita la entrada a 500 caracteres
              /></div>
          )}
        </div>

        <div className="mb-10">
          {status === "OPEN" && (
            <button
              className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
              onClick={(e) => {
                handleDeleteTicket(e);
              }}
              disabled={!subject || !description || !status || !createdAt}
            >
              <i className="material-icons">delete</i>
            </button>
          )}
        </div>
        <div className="mb-10">
          {status === "OPEN" && (
            <button
              className="absolute bottom-0 right-0 mb-4 mr-16 p-2 bg-blue-500 text-white rounded-full"
              onClick={(e) => {
                handleEdit(e);
              }}
              disabled={!subject || !description || !status || !createdAt}
            >
              <i className="material-icons">edit</i>
            </button>
          )}
        </div>
        <div className="mb-10">
          {status === "CLOSED" && (
            <div>

              {isReportCreated && (
                <div>
                  <button className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-blue-500 text-white rounded-full" onClick={(e) => { handleViewReport(e) }} disabled={!subject || !description || !status || !createdAt} >Ver reporte</button>
                  {archived === "false" && (
                  <button className="absolute bottom-0 right-0 mb-4 mr-40 p-2 bg-red-500 text-white rounded-full" onClick={(e) => { handleArchiveTicket(e) }} disabled={!subject || !description || !status || !createdAt} >Archivar ticket</button>
                  )}   
                </div>
              )}
            </div>

          )}
        </div>

      </div>
    </div>
  );
}
export default () => (
 <ApolloProvider client={client}>
    <TicketPage />
  </ApolloProvider>
)
