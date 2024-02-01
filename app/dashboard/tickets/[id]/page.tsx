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
import { DELETE_TICKET_MUTATION } from "@/apollo/mutation";
import { parse } from 'path';

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
  const subject = sorted.get('subject');
  const description = sorted.get('description');
  const status = sorted.get('status');
  const createdAt = sorted.get('createdAt');

  const [deleteTicket] = useMutation(DELETE_TICKET_MUTATION, {
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
  //const { subject } = useParams();

  //await loadTicket(params.ticketId);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 ">
      <div className=" relative p-8 bg-white rounded shadow-md w-1/2 mt-12">
        <h1 className="text-2xl font-bold mb-4">{firstNameUser} {lastNameUser}</h1>
        <p className="mb-4">{emailUser}</p>
        <h2 className="text-xl font-semibold mb-2">{subject}</h2>
        <p className="mb-4">{description}</p>
        <p className="mb-4">{createdAt}</p>

        <span className={`inline-block px-3 py-1 rounded text-white ${status === 'OPEN' ? 'bg-green-500' :
          status === 'IN_PROGRESS' ? 'bg-yellow-500' :
            status === 'CLOSED' ? 'bg-red-500' :
              ''
          }`}>{status}</span>
        {status !== 'IN_PROGRESS' && (
          <button
            className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
            onClick={handleDeleteTicket}
          >
            <i className="material-icons">delete</i>
          </button>
        )}
      </div>

    </div>
  );

} export default TicketPage;