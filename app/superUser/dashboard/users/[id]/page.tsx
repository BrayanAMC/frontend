'use client'
import { useSearchParams, useParams } from 'next/navigation';
import { ApolloClient, InMemoryCache, createHttpLink, useMutation } from "@apollo/client"
import { DELETE_USER_MUTATION } from '@/apollo/mutation';

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
    });

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

function UserPage(){
    const { id }  = useParams();   
    const sorted = useSearchParams();
    const firstName = sorted.get('firstName');
    const lastName = sorted.get('lastName');
    const email = sorted.get('email');
    const password = sorted.get('password');
    const accessToken = sorted.get('accessToken');
    const recoveryPasswordToken = sorted.get('recoveryPasswordToken');
    const role = sorted.get('role');
    const institutionId = sorted.get('institutionId');
    const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
        client, 
    });

    const handleDelete = async (e: React.FormEvent) => {
        //const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);

        const {data} = await deleteUser({
            variables: {
                deleteUserInput: {
                  email: email,
                },
              },
        })
        console.log("datos de la api llamada [id]: ", data);
        if(data?.deleteUser?.success){
            alert("User deleted successfully");
            window.location.href = '/superUser/dashboard';
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 ">
            <div className= "relative p-8 bg-white rounded shadow-md w-1/2 mt-12">
                <h1 className="text-2xl font-bold mb-4">{firstName} {lastName}</h1>
                <h2 className="mb-4">{email}</h2>
                <h2 className='mb-4'>{role}</h2>
                <button 
                    className= "absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
                    onClick={handleDelete}>
                    <i className="material-icons">delete</i>
                </button>
            </div>
        </div>
    )


}export default UserPage;