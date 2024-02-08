'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { ApolloClient, InMemoryCache, createHttpLink, gql, useMutation } from "@apollo/client";
import { CREATE_TICKET_MUTATION } from "@/apollo/mutation"

function TicketForm() {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [institutionId, setInstitutionId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);


    const httpLink = createHttpLink({
        uri: 'http://localhost:3002/graphql',
    });

    const client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });

    const [registerTicket] = useMutation(CREATE_TICKET_MUTATION, {
        client,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userIdString = localStorage.getItem('idUser');
            const userIdInt = userIdString ? parseInt(userIdString) : null;
            const institutionId = localStorage.getItem('institutionId');
            const institutionIdInt = institutionId ? parseInt(institutionId) : null;
            setUserId(userIdInt);
            setInstitutionId(institutionIdInt);
        }   
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !description || userId === null) {
            setError("Error: falta de campos o error de usuario.");
            return;
        }

        try {
            const input = {
                subject,
                description,
                userId,
                institutionId
            };
            const { data } = await registerTicket({
                variables: { createTicketInput: input }
            });

            console.log("datos de la api: ", data);
            if(data && data.createTicket){
                setSubject('');
                setDescription('');
                setError(null);
                await new Promise((resolve) => setTimeout(resolve, 500));
                window.alert("Ticket creado con éxito");
                setShowAlert(true);
            }

        } catch (error) {
            setError("Hubo un error grave.");
            window.alert("Error al crear el ticket");
            setShowAlert(true);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
                <div className="flex flex-col space-y-4">
                    <div>
                        <Label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</Label>
                        <Input
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            id="subject"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</Label>
                        <Input
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            id="description"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <Button type="submit" className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</Button>
            </form>
        </div>
    );

} export default TicketForm;