
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
    if (window.confirm("¿Estás seguro de que quieres eliminar este ticket?")) {
      if (status === "OPEN" || status === "CLOSED") {
        console.log("en funcion handleDeleteTicket");
        const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);
        const input = {
          id: id,
        };
  
        const { data } = await deleteTicket({
          variables: { id: idNumber },
        });
        //console.log("datos de la api llamada [id]: ", data);
        if (data?.deleteTicket.success) {
          alert("Ticket eliminado correctamente.");
          //window.location.href = "/dashboard/tickets";
          history.back();
        }
      } else {
        alert("No puedes eliminar un ticket que está en progreso.");
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    if(window.confirm("¿Estás seguro de que quieres editar este ticket?")){
      const url = new URL(window.location.href);
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
        //window.location.href = "/dashboard/tickets";
        const searchParams = new URLSearchParams(url.search);
        searchParams.set("subject", data?.updateTicket.subject);
        searchParams.set("description", data?.updateTicket.description);
        url.search = searchParams.toString();
        window.history.replaceState({}, "", url.toString());
        window.location.reload();
      }
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
    if(window.confirm("¿Estás seguro de que quieres archivar este ticket?")){
      //console.log("en funcion handleArchiveTicket");
      const ticketId = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del ticket pasado a entero
      console.log("ticketId ", ticketId);
      try {
        const { data } = await archiveReport({
          variables: {
            ticketId: ticketId,
          },
        });
        //console.log("data archiveReport ", data);

        if (data?.archiveTicket.success) {
          alert("Ticket archivado correctamente.");
          //window.location.href = `/admin/tickets/${userId}`;
          history.back();
        }
      } catch (error) {
        alert((error as Error).message);
      }
    }  
  }
  //const { subject } = useParams();

  //await loadTicket(params.ticketId);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#16202a] ">
      <div className=" relative p-8 bg-[#26313c] rounded shadow-md w-1/2 mt-12">
        <h1 className=" text-white text-2xl font-bold mb-4">
          {firstNameUser} {lastNameUser}
        </h1>
        <p className="mb-4 text-white ">{emailUser}</p>
        <hr className="my-4 border-gray-200" />
        <Label className="text-white">Subject</Label>
        <h2 className="text-white text-xl font-semibold mb-2 break-words overflow-auto">
          {subject}
        </h2>
        <hr className="my-4 border-gray-200" />
        <Label className="text-white">Description</Label>
        <p className="text-white mb-4 break-words overflow-auto">{description}</p>
        <hr className="my-4 border-gray-200" />
        <Label className="text-white">Fecha de creacion</Label>
        <p className="mb-4 text-white">{createdAt}</p>
        <hr className="my-4 border-gray-200" />
        <div className="inline-flex flex-col ">
          <Label className="mb-2 text-white">Status</Label>
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
                className="block text-sm font-medium text-white mb-2"
              >
                Subject
              </Label>
              <Input
                className="bg-[#16202a] text-white"
                value={subject || ""}
                onChange={(e) => setSubject(e.target.value)}
                minLength={3}
                maxLength={100} // Limita la entrada a 100 caracteres
              /></div>
          )}
        </div>
        <div className="mb-6">

          {status !== "IN_PROGRESS" && status !== "CLOSED" && (
            <div>
              <Label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-2"
              >
                Description
              </Label>
              <textarea
                
                className="w-full text-white bg-[#16202a]"
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
              disabled={  !subject || !description || !status || !createdAt || subject.length < 3 || description.length < 3}
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
