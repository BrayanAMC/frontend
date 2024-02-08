

'use client'
import { useSearchParams, useParams } from 'next/navigation';
import { ApolloClient, InMemoryCache, createHttpLink, useMutation } from "@apollo/client"
import { DELETE_INSTITUTION_MUTATION } from '@/apollo/mutation';

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
  });
  
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

function InstitutionPage() {

    const { id }  = useParams();
    const sorted = useSearchParams();
    const name = sorted.get('name');
    const email = sorted.get('email');
    const phoneNumber = sorted.get('phoneNumber');

    const [deleteInstitution] = useMutation(DELETE_INSTITUTION_MUTATION, {
        client, 
      
    });

    const handleDelete = async (e: React.FormEvent) => {
        const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);

        const {data} = await deleteInstitution({
            variables: { id: idNumber, }
        })
        console.log("datos de la api llamada [id]: ", data);
        if(data?.deleteInstitution?.success){
            alert("Institution deleted successfully");
            window.location.href = '/superUser/dashboard';
        
        }
    }


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 ">
            <div className= "relative p-8 bg-white rounded shadow-md w-1/2 mt-12">
                <h1 className="text-2xl font-bold mb-4">{name}</h1>
                <h2 className="mb-4">{email}</h2>
                <h2 className='mb-4'>{phoneNumber}</h2>
                <button 
                    className= "absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
                    onClick={handleDelete}>
                    <i className="material-icons">delete</i>
                
                </button>
            </div>
        </div>
    )
}
export default InstitutionPage;