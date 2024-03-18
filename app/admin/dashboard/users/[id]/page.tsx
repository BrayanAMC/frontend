"use client";
import { useRouter } from 'next/navigation';
import { useSearchParams, useParams } from "next/navigation";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  useMutation,
} from "@apollo/client";
import { DELETE_USER_MUTATION } from "@/apollo/mutation";
import { UPDATE_USER_MUTATION } from "@/apollo/mutation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useEffect } from 'react';
import { httpLink } from "@/components/apolloConfig/apolloConfig";

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function UserPage() {

  const router = useRouter();
  
  const { id } = useParams();
  const sorted = useSearchParams();
  const [firstName, setFirstName] = useState(sorted.get("firstName"));
  const [lastName, setLastName] = useState(sorted.get("lastName"));
  const [email, setEmail] = useState(sorted.get("email"));
  const password = sorted.get("password");
  const accessToken = sorted.get("accessToken");
  const recoveryPasswordToken = sorted.get("recoveryPasswordToken");
  const role = sorted.get("role");
  const institutionId = sorted.get("institutionId");
  const originalEmail = sorted.get("email");
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    client,
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    client,
  });

  

  const handleDelete = async (e: React.FormEvent) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      //const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);

      const { data } = await deleteUser({
        variables: {
          deleteUserInput: {
            email: email,
          },
        },
      });
      //console.log("datos de la api llamada [id]: ", data);
      if (data?.deleteUser?.success) {
        alert("User deleted successfully");
        //window.location.href = "/admin/dashboard";
        history.back();
      }
    }  
  };

  const handleEdit = async (e: React.FormEvent) => {
    if (window.confirm("¿Estás seguro que deseas editar este usuario?")) {
      const url = new URL(window.location.href);
      const { data } = await updateUser({
        variables: {
          updateUserInput: {
            firstName: firstName,
            lastName: lastName,
            newEmail: email,
            oldEmail: originalEmail,
          },
        },
      });
      console.log("datos de la api handleEdit [id]: ", data);
      if (data?.updateUser?.id) {
        alert("User updated successfully");
        //window.location.href = "/admin/dashboard";
        const searchParams = new URLSearchParams(url.search);
        searchParams.set("firstName", data?.updateUser.firstName);
        searchParams.set("lastName", data?.updateUser.lastName);
        searchParams.set("email", data?.updateUser.email);
        url.search = searchParams.toString();
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    }  
  };

  const handleViewTickets = () => {
    window.location.href = "/admin/tickets/${id}";
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#16202a] ">
      <div className="relative p-8 bg-[#26313c] rounded shadow-md w-1/2 mt-12">
        <h1 className="text-2xl font-bold mb-4 text-white">
          {firstName} {lastName}
        </h1>
        <h2 className="mb-4 text-white">{email}</h2>
        {/*<h2 className="mb-4">{role}</h2>*/}
        <></>
        <div className="mb-6 text-white">
          <Input
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-6 text-white">
          <Input
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-6 text-white">
          <Input
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-10">
          <button
            className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-red-500 text-white rounded-full"
            onClick={handleDelete}
            disabled={!firstName || !lastName || !email}
          >
            <i className="material-icons">delete</i>
          </button>

          <div className="mb-10">
            <button
              className="absolute bottom-0 right-0 mb-4 mr-16 p-2 bg-blue-500 text-white rounded-full"
              onClick={handleEdit}
              disabled={!firstName || !lastName || !email}
            >
              <i className="material-icons">edit</i>
            </button>
          </div>
          <div className="mb-10">
          <Link href={`/admin/tickets/${id}?firstName=${firstName}&lastName=${lastName}`}>
            <button className="absolute bottom-0 right-0 mb-4 mr-28 p-2 bg-green-500 text-white rounded-full">
              Ver Tickets
            </button>
          </Link>
        </div>
        <div className="mb-10">
          <Link href={`/admin/ticketsArchivados/${id}?email=${email}&firstName=${firstName}&lastName=${lastName}`}>
            <button className="absolute bottom-0 right-0 mb-4 mr-56 p-2 bg-red-500 text-white rounded-full">
              Ver Tickets archivados
            </button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
export default UserPage;
