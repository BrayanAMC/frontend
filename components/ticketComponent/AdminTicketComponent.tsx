"use client";
import { useRouter } from 'next/navigation';
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, createHttpLink, useMutation, ApolloProvider, useQuery } from "@apollo/client";
import { ARCHIVE_REPORT_MUTATION, CHANGE_STATUS_TO_CLOSED_MUTATION, CHANGE_STATUS_TO_IN_PROGRESS_MUTATION, CREATE_REPORT_MUTATION, DELETE_TICKET_MUTATION, UPDATE_TICKET_MUTATION } from "@/apollo/mutation";
import { GET_REPORT_QUERY, GET_USER_QUERY } from "@/apollo/queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from 'react-modal';
import jsPDF from "jspdf";
import { generateReport } from '@/components/generateReport/generateReport';
import queryString from 'query-string';
import { generateReportToBase64 } from '@/components/generateReport/generateReport';
import { SEND_REPORT_TO_USER_MUTATION } from "@/apollo/mutation";
import { httpLink } from "@/components/apolloConfig/apolloConfig";

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function AdminTicketComponent() {
  const router = useRouter();
  const { id } = useParams(); //id del ticket
  //if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#__next')
  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstNameUser = localStorage.getItem("firstNameUser");
      const lastNameUser = localStorage.getItem("lastNameUser");
      const emailUser = localStorage.getItem("emailUser");
      const adminUserId = localStorage.getItem("idUser");
      if (process.env.NODE_ENV !== 'test') Modal.setAppElement('body');
      setAdminUserId(adminUserId);
      setFirstNameUser(firstNameUser);
      setLastNameUser(lastNameUser);
      setEmailUser(emailUser);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(`reportCreatedForTicket${id}`)) {
      setReportCreated(true);
    }
  }, [id]);
  //datos de entrada para el informe de visita tecnica
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipoDeVisita, setTipoDeVisita] = useState("");
  const [problemaEncontrado, setProblemaEncontrado] = useState("");
  const [detalleProblema, setDetalleProblema] = useState("");
  const [trabajoRealizado, setTrabajoRealizado] = useState("");
  const [detalleTrabajo, setDetalleTrabajo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  //fin de datos de entrada para el informe de visita tecnica
  const [firstNameUser, setFirstNameUser] = useState<string | null>(null);
  const [lastNameUser, setLastNameUser] = useState<string | null>(null);
  const [emailUser, setEmailUser] = useState<string | null>(null);
  const [isReportCreated, setReportCreated] = useState(false);
  //const [reportId, setReportId] = useState<number | null>(null);
  const sorted = useSearchParams();
  const [subject, setSubject] = useState(sorted.get("subject"));
  const [description, setDescription] = useState(sorted.get("description"));
  const status = sorted.get("status");
  const createdAt = sorted.get("createdAt");
  const userId = sorted.get("userId"); //id del usuario dueño del ticket
  const archived = sorted.get("archived");
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
  const [createReport] = useMutation(CREATE_REPORT_MUTATION, {
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
    if (window.confirm("¿Estás seguro de que quieres editar este ticket?")) {
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
      //console.log("data update ticket ", data);
      if (data?.updateTicket.id) {
        alert("Ticket updated successfully");
        //window.location.href = `/admin/tickets/${userId}`;
        const searchParams = new URLSearchParams(url.search);
        searchParams.set("subject", data?.updateTicket.subject);
        searchParams.set("description", data?.updateTicket.description);
        url.search = searchParams.toString();
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    }  
  };

  const handleInProgress = async (e: React.FormEvent) => {
    if (window.confirm("¿Estás seguro de que quieres cambiar el estado a IN_PROGRESS?")) {
      const url = new URL(window.location.href);
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
      //console.log("data changeStatusToInProgress ", data);
      if (data?.changeStatusToInProgress.success) {
        alert("Ticket updated successfully");
        //cambiar el estado de la url a IN_PROGRESS
        const searchParams = new URLSearchParams(url.search);
        searchParams.set('status', 'IN_PROGRESS');
        url.search = searchParams.toString();
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    }  
  };

  const handleClosed = async (e: React.FormEvent) => {
    if (window.confirm("¿Estás seguro de que quieres cambiar el estado a CLOSED?")) {
      const url = new URL(window.location.href);
      //console.log("en funcion handleClosed");
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
      //console.log("data changeStatusToClosed ", data);
      if (data?.changeStatusToClosed.success) {
        alert("Ticket updated successfully");
        const searchParams = new URLSearchParams(url.search);
        searchParams.set('status', 'CLOSED');
        url.search = searchParams.toString();
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    }  
  }

  const handleCreateReport = async (e: React.FormEvent) => {
    //console.log("en funcion handleCreateReport");
    setIsModalOpen(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("en funcion handleSubmit");
    // Llama a tu mutación para crear el informe aquí
    const ticketId = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del ticket pasado a entero
    const fechaToString = fecha.toString();

    try {
      const { data } = await createReport({
        variables: {
          createPdfInput: {
            nombre: nombre,
            localidad: localidad,
            fecha: fechaToString,
            tipoDeVisita: tipoDeVisita,
            problemaEncontrado: problemaEncontrado,
            detalleProblema: detalleProblema,
            trabajoRealizado: trabajoRealizado,
            detalleTrabajo: detalleTrabajo,
            observaciones: observaciones,
            ticketId: ticketId,
          },
        },
      });
      //console.log("data createReport ", data);

      if (data && data.createPdf.id) {
        console.log("entro al if");
        alert("Reporte creado correctamente.");
        localStorage.setItem(`reportCreatedForTicket${ticketId}`, 'true');
        localStorage.setItem(`reportIdForTicket${ticketId}`, data.createPdf.id);
        //setReportId(data.createPdf.id);
        setReportCreated(true);
        //setIsModalOpen(false);
      }
      //alert("Reporte creado correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      alert((error as Error).message);
    }
  };
  //llamada a la api para obtener el reporte
  let reportIdInt = null;
  // Verifica si window está definido
  if (typeof window !== 'undefined') {
    // Si window está definido, entonces estamos en el cliente y podemos acceder a localStorage
    reportIdInt = localStorage.getItem(`reportIdForTicket${id}`) ? parseInt(localStorage.getItem(`reportIdForTicket${id}`) as string, 10) : null;
  }
 
  const { loading, error, data, refetch } = useQuery(GET_REPORT_QUERY, {
    variables: { id: reportIdInt },
    skip: reportIdInt === null
  });

  const handleViewReport = async (e: React.FormEvent) => {
    //console.log("en funcion handleViewReport");
    refetch().then(response => {
      //console.log("data getReport ", response.data);//transformar data a pdf
      generateReport(response.data);
    });
  }

  const handleArchiveTicket = async (e: React.FormEvent) => {
    if (window.confirm("¿Estás seguro de que quieres archivar este ticket?")) {
      const url = new URL(window.location.href);
      //console.log("en funcion handleArchiveTicket");
      const ticketId = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del ticket pasado a entero
      //console.log("ticketId ", ticketId);
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
          const searchParams = new URLSearchParams(url.search);
          searchParams.set('archived', 'true');
          url.search = searchParams.toString();
          window.history.replaceState({}, '', url.toString());
          window.location.reload();
        }
      } catch (error) {
        alert((error as Error).message);
      }
    }  
  }
  //obtener el email usando el userId del ticket

  const userIdInt = parseInt(Array.isArray(userId) ? userId[0] : userId, 10);
  const { loading: loadingUser, error: errorUser, data: dataUser, refetch: refetchUser } = useQuery(GET_USER_QUERY, {
    variables: { id: userIdInt },
    skip: userIdInt === null
  });

  if (dataUser) {
    //console.log("dataUser ", dataUser);
  }

  useEffect(() => {
    if (dataUser) {
      
      setEmailUser(dataUser.user.email);
    }
  }, [dataUser]);

  const [sendReport] = useMutation(SEND_REPORT_TO_USER_MUTATION,{
    client,
  });

  const handleSendReport = async () => {
    //console.log("en funcion handleSendReport");
    const email = emailUser;
    //console.log("email ", email);
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

        //console.log("Mutation response data: ", data);
        if (data.sendPdfToUser.success) {
            alert("Reporte enviado al usuario");
        }else{
            alert("Error al enviar el reporte");
        }
    });
  }
 
  return (
    <div className="flex flex-col items-center justify-start min-h-screenbg-[#16202a] ">
      <div className=" relative p-8 bg-[#26313c] rounded shadow-md w-1/2 mt-12">
        <Label className="text-white">Subject</Label>
        <h2 className="text-xl text-white font-semibold mb-2 break-words overflow-auto">{subject}</h2>
        <hr className="my-4 border-gray-200" />
        <Label className="text-white">Description</Label>
        <p className="mb-4 break-words overflow-auto text-white">{description}</p>
        <hr className="my-4 border-gray-200" />
        <Label className="text-white">Fecha Creacion</Label>
        <p className="mb-4 text-white">{createdAt}</p>
        <hr className="my-4 border-gray-200" />
        <Label className="text-white">Correo usuario</Label>
        <h2 className="text-xl text-white font-semibold mb-2 break-words overflow-auto">{emailUser}</h2>
        <hr className="my-4 border-gray-200" />
        <span
          className={`inline-block px-3 py-1 rounded text-white ${status === "OPEN" 
          ? "bg-green-500" : status === "IN_PROGRESS" ? "bg-yellow-500" : status === "CLOSED" ? "bg-red-500" : ""}`}>
          {status}
        </span>
        <></>
        <div className="mb-10">
          {status === "OPEN" ? (
            <div>
              <div className="mb-6 mt-4">
                <Input
                  className="text-white" value={subject || ""} minLength={3} maxLength={100} onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <textarea
                  className="w-full text-white bg-[#16202a]"
                  value={description || ""} rows={5} minLength={3} maxLength={300} onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                className="relative bottom-0 right-0 mb-16 mr-8 mr-2  p-2 bg-blue-500 text-white rounded-full" onClick={handleEdit}
                disabled={!subject || !description || !status || !createdAt || subject.length < 3 || description.length < 3}
              >
                <i className="material-icons">edit</i>
              </button>
              <button className="relative bottom-0 right-0  mr-80 p-2 bg-red-500 text-white rounded-full" onClick={handleDeleteTicket} >
                <i className="material-icons">delete</i>
              </button>
              <button className="absolute bottom-36 right-0 mr-8  p-2 bg-yellow-500 text-white rounded-full"
                onClick={(e) => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que quieres cambiar el estado a IN_PROGRESS?" )
                  ) {
                    handleInProgress(e);
                  }
                }}
                disabled={!subject || !description || !status || !createdAt}
              > Cambiar estado a IN_PROGRESS
              </button></div>
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
            > Cambiar estado a CLOSED
            </button>
          ) : status === "CLOSED" ? (
            <div>
              {isReportCreated && (
                <div>
                  <button className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-blue-500 text-white rounded-full" onClick={(e) => { handleViewReport(e) }} disabled={!subject || !description || !status || !createdAt} >Ver reporte</button>
                  <button className="absolute bottom-0 right-0 mb-4 mr-80 p-2 bg-yellow-500 text-white rounded-full"
                            onClick={handleSendReport}
                            disabled={!subject || !description || !status || !createdAt}
                        > Enviar reporte al usuario
                        </button>
                  {archived === "false" && (
                  <button className="absolute bottom-0 right-0 mb-4 mr-40 p-2 bg-red-500 text-white rounded-full" onClick={(e) => { handleArchiveTicket(e) }} disabled={!subject || !description || !status || !createdAt} >Archivar ticket</button>
                  )}   
                </div>
              )}
              {!isReportCreated && (
                <button
                  className="absolute bottom-0 right-0 mb-4 mr-8 p-2 bg-blue-500 text-white rounded-full"
                  onClick={(e) => {
                    handleCreateReport(e);
                  }}
                  disabled={!subject || !description || !status || !createdAt} >
                  Crear reporte
                </button>)}
              <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="flex flex-col items-center justify-center min-h-screen bg-[#16202a]">
                <form onSubmit={handleSubmit} className="p-6 bg-[#26313c] rounded shadow-md" style={{ maxWidth: '600px', width: '100%' }}>
                  <div className="mb-4">
                    <Label htmlFor="nombre" className="block text-sm font-medium text-white">Nombre</Label>
                    <Input required value={nombre} onChange={(e) => setNombre(e.target.value)} id="nombre" type="text" maxLength={22} className="bg-[#26313c] text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="localidad" className="block text-sm font-medium text-white">Localidad</Label>
                    <Input required value={localidad} onChange={(e) => setLocalidad(e.target.value)} id="localidad" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="fecha" className="block text-sm font-medium text-white">Fecha</Label>
                    <Input required value={fecha} onChange={(e) => setFecha(e.target.value)} id="fecha" type="date" className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="tipoDeVisita" className="block text-sm font-medium text-white">Tipo de visita</Label>
                    <Input required value={tipoDeVisita} onChange={(e) => setTipoDeVisita(e.target.value)} id="tipoDeVisita" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="problemaEncontrado" className="block text-sm font-medium text-white">Problema encontrado</Label>
                    <Input required value={problemaEncontrado} onChange={(e) => setProblemaEncontrado(e.target.value)} id="problemaEncontrado" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="detalleProblema" className="block text-sm font-medium text-white">Detalle del problema</Label>
                    <Input value={detalleProblema} onChange={(e) => setDetalleProblema(e.target.value)} id="detalleProblema" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="trabajoRealizado" className="block text-sm font-medium text-white">Trabajo realizado</Label>
                    <Input required value={trabajoRealizado} onChange={(e) => setTrabajoRealizado(e.target.value)} id="trabajoRealizado" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="detalleTrabajo" className="block text-sm font-medium text-white">Detalle del trabajo</Label>
                    <Input value={detalleTrabajo} onChange={(e) => setDetalleTrabajo(e.target.value)} id="detalleTrabajo" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="observaciones" className="block text-sm font-medium text-white">Observaciones</Label>
                    <Input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} id="observaciones" type="text" maxLength={30} className="text-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <button className="mt-6 bg-[#16202a] text-white font-bold py-2 px-4 rounded" type="submit">Enviar</button>
                </form>
              </Modal>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
const AdminTicketComponentComponent = () => (
  <ApolloProvider client={client}>
    <AdminTicketComponent />
  </ApolloProvider>
);
AdminTicketComponentComponent.displayName = 'AdminTicketComponentComponent';
export default AdminTicketComponentComponent;
