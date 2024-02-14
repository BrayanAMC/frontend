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
'use client'
import { useSearchParams, useParams, ReadonlyURLSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink, useMutation } from "@apollo/client"
import { DELETE_TICKET_MUTATION, UPDATE_TICKET_MUTATION } from "@/apollo/mutation";
import { parse } from 'path';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const httpLink = createHttpLink({
  uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});



function TicketPage() {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const firstNameUser = localStorage.getItem('firstNameUser');
      const lastNameUser = localStorage.getItem('lastNameUser');
      const emailUser = localStorage.getItem('emailUser');
      setFirstNameUser(firstNameUser);
      setLastNameUser(lastNameUser);
      setEmailUser(emailUser);

    }
  }, []);

  const [firstNameUser, setFirstNameUser] = useState<string | null>(null);
  const [lastNameUser, setLastNameUser] = useState<string | null>(null);
  const [emailUser, setEmailUser] = useState<string | null>(null);

  //const router = useRouter();
  const { id }  = useParams();
  
  const sorted = useSearchParams();
  const [subject, setSubject] = useState(sorted.get('subject'));
  const [description, setDescription] = useState(sorted.get('description'));
 
  const status = sorted.get('status');
  const createdAt = sorted.get('createdAt');

  const [deleteTicket] = useMutation(DELETE_TICKET_MUTATION, {
    client, 
  });

  const [updateTicket] = useMutation(UPDATE_TICKET_MUTATION, {
    client, 
  });

  const handleDeleteTicket = async (e: React.FormEvent) => {
    if (status === 'OPEN' || status === 'CLOSED') {
      console.log("en funcion handleDeleteTicket")
      const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);
      const input = {
        id: id,
      };

      const { data } = await deleteTicket({
        variables: { id: idNumber },
      });
      console.log("datos de la api llamada [id]: ", data);
      if (data?.deleteTicket.success) {
        alert('Ticket eliminado correctamente.');
        window.location.href = '/dashboard/tickets';
      }
      
      
    } else {
      alert('No puedes eliminar un ticket que está en progreso.');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);

    const {data} = await updateTicket({
      variables: {
        updateTicketInput: {
          id: idNumber,
          subject: subject,
          description: description,
          
        }
      }
    })
    console.log("data update ticket ", data);
    if (data?.updateTicket.id) {
      alert("Ticket updated successfully");
      window.location.href = "/dashboard/tickets";
    }

  }
  //const { subject } = useParams();

  //await loadTicket(params.ticketId);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 " >
      <div className=" relative p-8 bg-white rounded shadow-md w-1/2 mt-12" >
        <h1 className="text-2xl font-bold mb-4">{firstNameUser} {lastNameUser}</h1>
        <p className="mb-4">{emailUser}</p>
        <h2 className="text-xl font-semibold mb-2 break-words overflow-auto">{subject}</h2>
        <p className="mb-4 break-words overflow-auto">{description}</p>
        <p className="mb-4">{createdAt}</p>

        <span className={`inline-block px-3 py-1 rounded text-white ${status === 'OPEN' ? 'bg-green-500' :
          status === 'IN_PROGRESS' ? 'bg-yellow-500' :
            status === 'CLOSED' ? 'bg-red-500' :
              ''
          }`}>{status}</span>
        {status !== 'IN_PROGRESS' && (
          <button
            className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
            onClick={(e) => {
              if (status !== 'IN_PROGRESS') {
                handleDeleteTicket(e);
              } else {
                alert('No puedes eliminar un ticket que está en progreso.');
              }
            }}
          >
            <i className="material-icons">delete</i>
          </button>
        )}
        <></>
        <div className="mb-6">
        <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </Label>
          <Input 
            value={subject || ""} 
            onChange={(e) => setSubject(e.target.value)} 
            disabled={status === 'IN_PROGRESS' || status === 'CLOSED'}
            maxLength={100} // Limita la entrada a 100 caracteres
          />
            
        </div>
        <div className="mb-6" >
        <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </Label>
          <textarea
            className='w-full'
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            disabled={status === 'IN_PROGRESS' || status === 'CLOSED'}
            rows={5} // Ajusta esto para cambiar la altura
            maxLength={300} // Limita la entrada a 500 caracteres
          />
        </div>
        
        <div className="mb-10">
          <button
            className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
            onClick={(e) => {
              if (status !== 'IN_PROGRESS') {
                handleDeleteTicket(e);
              } else {
                alert('No puedes eliminar un ticket que está en progreso.');
              }
            }}
            disabled={!subject || !description || !status || !createdAt}
          >
            <i className="material-icons">delete</i>
          </button>

        </div>
        <div className="mb-10">
          <button
            className="absolute bottom-0 right-0 mb-4 mr-16 p-2 bg-blue-500 text-white rounded-full"
            onClick={(e) => {
              if (status === 'OPEN') {
                handleEdit(e);
              } else {
                alert('No puedes editar un ticket que no está en estado OPEN.');
              }
            }}
            disabled={!subject || !description || !status || !createdAt}
          >
            <i className="material-icons">edit</i>
          </button>

        </div>

      </div>

    </div>
  );

} export default TicketPage;