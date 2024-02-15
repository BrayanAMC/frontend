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
  useSearchParams,
  useParams,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  useMutation,
} from "@apollo/client";
import {
  CHANGE_STATUS_TO_CLOSED_MUTATION,
  CHANGE_STATUS_TO_IN_PROGRESS_MUTATION,
  DELETE_TICKET_MUTATION,
  UPDATE_TICKET_MUTATION,
} from "@/apollo/mutation";
import { parse } from "path";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      const adminUserId = localStorage.getItem("idUser");
      setAdminUserId(adminUserId);
      setFirstNameUser(firstNameUser);
      setLastNameUser(lastNameUser);
      setEmailUser(emailUser);
    }
  }, []);

  const [firstNameUser, setFirstNameUser] = useState<string | null>(null);
  const [lastNameUser, setLastNameUser] = useState<string | null>(null);
  const [emailUser, setEmailUser] = useState<string | null>(null);

  //const router = useRouter();
  const { id } = useParams(); //id del ticket

  const sorted = useSearchParams();
  const [subject, setSubject] = useState(sorted.get("subject"));
  const [description, setDescription] = useState(sorted.get("description"));

  const status = sorted.get("status");
  const createdAt = sorted.get("createdAt");
  const userId = sorted.get("userId"); //id del usuario dueño del ticket

  const [adminUserId, setAdminUserId] = useState<string | null>(null); //id del admin

  const [deleteTicket] = useMutation(DELETE_TICKET_MUTATION, {
    client,
  });

  const [updateTicket] = useMutation(UPDATE_TICKET_MUTATION, {
    client,
  });

  const [changeStatusToInProgress] = useMutation(CHANGE_STATUS_TO_IN_PROGRESS_MUTATION, {
    client,
  });

  const [changeStatusToClosed] = useMutation(CHANGE_STATUS_TO_CLOSED_MUTATION, {
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

  const handleInProgress = async (e: React.FormEvent) => {
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);
    const userIdNumber = parseInt(Array.isArray(userId) ? userId[0] : userId, 10);
    const adminUserIdNumber = parseInt(Array.isArray(adminUserId) ? adminUserId[0] : adminUserId, 10);
    if (isNaN(adminUserIdNumber)) {
      // Handle the case where adminUserId is null
      alert("Admin user ID is not set.");
      return;
    }
    const { data } = await changeStatusToInProgress({
      variables: {
        id: idNumber,
        userId: userIdNumber,
        assignedToId: adminUserIdNumber,
      },
    });
    console.log("data changeStatusToInProgress ", data);
    if (data?.changeStatusToInProgress.success) {
      alert("Ticket updated successfully");
      window.location.href = `/admin/tickets/${userId}`;
    }
  };

  const handleClosed = async (e: React.FormEvent) => {
    console.log("en funcion handleClosed");
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);
    const userIdNumber = parseInt(Array.isArray(userId) ? userId[0] : userId, 10);
    const adminUserIdNumber = parseInt(Array.isArray(adminUserId) ? adminUserId[0] : adminUserId, 10);
    if (isNaN(adminUserIdNumber)) {
      // Handle the case where adminUserId is null
      alert("Admin user ID is not set.");
      return;
    }
    const { data } = await changeStatusToClosed({
      variables: {
        id: idNumber,
        userId: userIdNumber,
        assignedToId: adminUserIdNumber,
      },
    });
    console.log("data changeStatusToClosed ", data);
    if (data?.changeStatusToClosed.success) {
      alert("Ticket updated successfully");
      window.location.href = `/admin/tickets/${userId}`;
    }
  }
  
  const handleUploadReport = async (e: React.FormEvent) => {
    console.log("en funcion handleUploadReport");
  }
  //const { subject } = useParams();

  //await loadTicket(params.ticketId);

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
          className={`inline-block px-3 py-1 rounded text-white ${
            status === "OPEN"
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
        {status !== "IN_PROGRESS" && (
          <button
          style={{ display: 'none' }}
            className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
            onClick={(e) => {
              if (status !== "IN_PROGRESS") {
                handleDeleteTicket(e);
              } else {
                alert("No puedes eliminar un ticket que está en progreso.");
              }
            }}
          >
            <i className="material-icons">delete</i>
          </button>
        )}
        <></>
        {/*<div className="mb-6">
          <Input
            value={subject || ""}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Input
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
          </div>*/}

        <div className="mb-10">
          <button
            style={{ display: 'none' }}
            className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
            onClick={(e) => {
              if (status !== "IN_PROGRESS") {
                handleDeleteTicket(e);
              } else {
                alert("No puedes eliminar un ticket que está en progreso.");
              }
            }}
            disabled={!subject || !description || !status || !createdAt}
          >
            <i className="material-icons">delete</i>
          </button>
        </div>
        <div className="mb-10">
          <button
            style={{ display: 'none' }}
            className="absolute bottom-0 right-0 mb-4 mr-16 p-2 bg-blue-500 text-white rounded-full"
            onClick={(e) => {
              if (status === "OPEN") {
                handleEdit(e);
              } else {
                alert("No puedes editar un ticket que no está en estado OPEN.");
              }
            }}
            disabled={!subject || !description || !status || !createdAt}
          >
            <i className="material-icons">edit</i>
          </button>
        </div>

        <div className="mb-10">
          {status === "OPEN" ? (
            <button
              className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-yellow-500 text-white rounded-full"
              onClick={(e) => {
                if (
                  window.confirm(
                    "¿Estás seguro de que quieres cambiar el estado a IN_PROGRESS?"
                  )
                ) {
                  handleInProgress(e);
                }
              }}
              disabled={!subject || !description || !status || !createdAt}
            >
              Cambiar estado a IN_PROGRESS
            </button>
          ) : status === "IN_PROGRESS" ? (
            <button
              className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-red-500 text-white rounded-full"
              onClick={(e) => {
                if (
                  window.confirm(
                    "¿Estás seguro de que quieres cambiar el estado a CLOSED?"
                  )
                ) {
                  handleClosed(e);
                }
              }}
              disabled={!subject || !description || !status || !createdAt}
            >
              Cambiar estado a CLOSED
            </button>
          ) : status === "CLOSED" ? (
            <button
              className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-blue-500 text-white rounded-full"
              onClick={(e) => {
                handleUploadReport(e);
                
              }}
              disabled={!subject || !description || !status || !createdAt} >
              Subir reporte
            </button>

          ): null}
        
        </div>
      </div>
    </div>
  );
}
export default TicketPage;
