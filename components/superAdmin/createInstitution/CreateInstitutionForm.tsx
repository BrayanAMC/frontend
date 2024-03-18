'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { ApolloClient, InMemoryCache, createHttpLink, gql, useMutation } from "@apollo/client";
import { CREATE_INSTITUTION_MUTATION } from "@/apollo/mutation";
import { httpLink } from "@/components/apolloConfig/apolloConfig";

function CreateInstitutionForm(){

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phoneNumber, setPhone ] = useState('');

    

    const client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });

    const [registerInstitucion] = useMutation(CREATE_INSTITUTION_MUTATION, {
        client,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phoneNumber) {
            console.log("Error: falta de campos o error de usuario.");
            return;
        }

        try {
            const input = {
                name,
                email,
                phoneNumber
            };
            const { data } = await registerInstitucion({
                variables: { createInstitutionInput: input }
            });

            console.log("datos de la api: ", data);
            if(data && data.createInstitution){
                setName('');
                setEmail('');
                setPhone('');
                await new Promise((resolve) => setTimeout(resolve, 500));
                window.alert("Institution created successfully");
                window.location.reload();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#16202a]">
            <form onSubmit={handleSubmit} className="p-6 rounded shadow-md bg-[#26313c] ">
                <div className="flex flex-col space-y-4 bg-[#26313c] text-white">
                    <div className="bg-[#26313c] ">
                        <Label htmlFor="subject" className="block text-sm font-medium text-white-700">nombre</Label>
                        <Input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                            type="text"
                            maxLength={50}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description" className="block text-sm font-medium text-white-700">email</Label>
                        <Input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            maxLength={50}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <Label htmlFor="subject" className="block text-sm font-medium text-white-700">numero de telefono</Label>
                        <Input
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhone(e.target.value)}
                            id="phoneNumber"
                            type="text"
                            maxLength={15}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <Button type="submit" className="mt-6  bg-[#16202a] text-white font-bold py-2 px-4 rounded">Submit</Button>
            </form>
        </div>
    );
}
export default CreateInstitutionForm;